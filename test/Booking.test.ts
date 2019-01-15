// During the test the env variable is set to test
process.env.NODE_ENV = "test";
require("dotenv").config();

// Import DB setup and models
import { db } from "../app/db";
import { Booking } from "../app/models/Booking";

// Import the dev-dependencies
import * as chai from "chai";
import chaiHttp = require("chai-http");
const should = chai.should();
chai.use(chaiHttp);

const apiPath = "/api/v1/booking/";
const server = "http://localhost:8888";

describe("Booking", () => {
  const token = process.env.JWT;

  describe("POST", () => {
    const bookingsId = [];

    // delete a created booking

    after(async () => {
      for (let id of bookingsId) {
        const booking: any = await Booking.findById(id);
        if (booking) {
          await Booking.destroy({ where: { id } });
        }
      }
    });

    it("Should post a booking", done => {
      const booking = {
        description: "Call Varma",
        room_id: 1,
        start: "2019-02-11T10:15:00",
        end: "2019-02-11T10:30:00",
        attendees: []
      };

      chai
        .request(server)
        .post(apiPath)
        .send(booking)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.an("object");
          res.body.should.have.property("id");
          res.body.should.have.property("description");
          res.body.should.have.property("room_id");
          res.body.should.have.property("start");
          res.body.should.have.property("end");
          res.body.should.have.property("user_id");
          res.body.should.have.property("event_id");
          res.body.should.have.property("updated_at");
          res.body.should.have.property("created_at");

          res.body.description.should.equal("Call Varma");
          res.body.room_id.should.equal(1);
          res.body.start.should.equal("2019-02-11T10:15:00.000Z");
          res.body.end.should.equal("2019-02-11T10:30:00.000Z");
          bookingsId.push(res.body.id);
          done();
        });
    });
    it("Should post a booking. Edge case: start time", done => {
      const booking = {
        description: "Call Varma",
        room_id: 1,
        start: "2019-02-11T10:30:00",
        end: "2019-02-11T10:45:00",
        attendees: []
      };

      chai
        .request(server)
        .post(apiPath)
        .send(booking)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.an("object");
          res.body.should.have.property("id");
          res.body.should.have.property("description");
          res.body.should.have.property("room_id");
          res.body.should.have.property("start");
          res.body.should.have.property("end");
          res.body.should.have.property("user_id");
          res.body.should.have.property("event_id");
          res.body.should.have.property("updated_at");
          res.body.should.have.property("created_at");

          res.body.description.should.equal("Call Varma");
          res.body.room_id.should.equal(1);
          res.body.start.should.equal("2019-02-11T10:30:00.000Z");
          res.body.end.should.equal("2019-02-11T10:45:00.000Z");
          bookingsId.push(res.body.id);
          done();
        });
    });
    it("Should post a booking. Edge case: end time", done => {
      const booking = {
        description: "Call Varma",
        room_id: 1,
        start: "2019-02-11T10:00:00",
        end: "2019-02-11T10:15:00",
        attendees: []
      };

      chai
        .request(server)
        .post(apiPath)
        .send(booking)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.an("object");
          res.body.should.have.property("id");
          res.body.should.have.property("description");
          res.body.should.have.property("room_id");
          res.body.should.have.property("start");
          res.body.should.have.property("end");
          res.body.should.have.property("user_id");
          res.body.should.have.property("event_id");
          res.body.should.have.property("updated_at");
          res.body.should.have.property("created_at");

          res.body.description.should.equal("Call Varma");
          res.body.room_id.should.equal(1);
          res.body.start.should.equal("2019-02-11T10:00:00.000Z");
          res.body.end.should.equal("2019-02-11T10:15:00.000Z");
          bookingsId.push(res.body.id);
          done();
        });
    });
    it("Try to schedule in a reserved date.", done => {
      const booking = {
        description: "Call Varma",
        room_id: 1,
        start: "2019-02-11T10:15:00",
        end: "2019-02-11T10:30:00",
        attendees: []
      };

      chai
        .request(server)
        .post(apiPath)
        .send(booking)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(204);
          done();
        });
    });
    it("Try to schedule with time out of office.", done => {
      const booking = {
        description: "Call Varma",
        room_id: 1,
        start: "2019-04-15T06:00:00",
        end: "2019-04-15T09:00:00",
        attendees: []
      };

      chai
        .request(server)
        .post(apiPath)
        .send(booking)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.equal(
            "bad Request: The booking only can have office hours (Monday-Friday, 8AM-6PM)."
          );
          done();
        });
    });
    it("Try to schedule in weekend.", done => {
      const booking = {
        description: "Call Varma",
        room_id: 1,
        start: "2019-12-14T12:00:00",
        end: "2019-12-14T13:00:00",
        attendees: []
      };

      chai
        .request(server)
        .post(apiPath)
        .send(booking)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.equal(
            "bad Request: The booking only can have office hours (Monday-Friday, 8AM-6PM)."
          );
          done();
        });
    });
    it("Try to schedule a meeting with a past date.", done => {
      const booking = {
        description: "Call Varma",
        room_id: 1,
        start: "2019-01-08T12:00:00",
        end: "2019-01-08T13:00:00",
        attendees: []
      };

      chai
        .request(server)
        .post(apiPath)
        .send(booking)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.equal(
            "bad Request: Bookings in past dates aren't allowed."
          );
          done();
        });
    });
    it("Try to schedule a meeting with an invalid email.", done => {
      const booking = {
        description: "Call Varma",
        room_id: 1,
        start: "2019-01-30T12:00:00",
        end: "2019-01-30T13:00:00",
        attendees: ["invalid@email"]
      };

      chai
        .request(server)
        .post(apiPath)
        .send(booking)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.equal("Bad Request: Invalid email.");
          done();
        });
    });
    it("Try to schedule a meeting without start date.", done => {
      const booking = {
        description: "Call Varma",
        room_id: 1,
        start: "",
        end: "2019-01-30T13:00:00",
        attendees: []
      };

      chai
        .request(server)
        .post(apiPath)
        .send(booking)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.equal("Bad Request: No start date in request.");
          done();
        });
    });
    it("Try to schedule a meeting without end date.", done => {
      const booking = {
        description: "Call Varma",
        room_id: 1,
        start: "2019-01-30T12:00:00",
        end: "",
        attendees: []
      };

      chai
        .request(server)
        .post(apiPath)
        .send(booking)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.equal("Bad Request: No end date in request.");
          done();
        });
    });
    it("Try to schedule a meeting without description.", done => {
      const booking = {
        description: "",
        room_id: 1,
        start: "2019-01-30T12:00:00",
        end: "2019-01-30T13:00:00",
        attendees: []
      };

      chai
        .request(server)
        .post(apiPath)
        .send(booking)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.equal("Bad Request: No description in request.");
          done();
        });
    });
    it("Try to schedule a meeting without roomId.", done => {
      const booking = {
        description: "Call Varma",
        start: "2019-01-30T12:00:00",
        end: "2019-01-30T13:00:00",
        attendees: []
      };

      chai
        .request(server)
        .post(apiPath)
        .send(booking)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.equal("Bad Request: No roomId in request.");
          done();
        });
    });
    it("Try to schedule a meeting with inexist roomId.", done => {
      const booking = {
        description: "Call Varma",
        roomId: 99,
        start: "2019-01-30T12:00:00",
        end: "2019-01-30T13:00:00",
        attendees: []
      };

      chai
        .request(server)
        .post(apiPath)
        .send(booking)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.equal(
            `Bad Request: room ${booking.roomId} not exist.`
          );
          done();
        });
    });
  });

  describe("PUT", () => {
    const bookingsId = [];

    // Create a booking to edit
    before(async () => {
      const bookingToEdit = {
        description: "This is a booking to edit",
        room_id: 1,
        start: "2019-02-11T10:15:00",
        end: "2019-02-11T10:25:00",
        attendees: []
      };

      const booking = {
        description: "This a booking useful for test cases",
        room_id: 1,
        start: "2019-02-11T10:30:00",
        end: "2019-02-11T10:45:00",
        attendees: []
      };

      // create a booking to edit
      const createdBookingToEdit = await chai
        .request(server)
        .post(apiPath)
        .send(bookingToEdit)
        .set("Authorization", `Bearer ${token}`);

      // create a booking, useful for test edge cases and reserved
      const createdBooking = await chai
        .request(server)
        .post(apiPath)
        .send(booking)
        .set("Authorization", `Bearer ${token}`);

      const parsedBookingToEdit = JSON.parse(
        JSON.stringify(createdBookingToEdit)
      );
      const parsedBooking = JSON.parse(JSON.stringify(createdBooking));

      bookingsId.push(JSON.parse(parsedBookingToEdit.text).id);
      bookingsId.push(JSON.parse(parsedBooking.text).id);
    });
    // Removes the bookings from the database
    after(async () => {
      for (let id of bookingsId) {
        const booking: any = await Booking.findById(id);
        if (booking) {
          await Booking.destroy({ where: { id } });
        }
      }
      await db.close();
    });

    it("Should edit a booking.", done => {
      const booking = {
        description: "This is a booking to edit x2",
        room_id: 1,
        start: "2019-02-11T10:00:00",
        end: "2019-02-11T10:10:00",
        attendees: []
      };
      chai
        .request(server)
        .put(apiPath + bookingsId[0])
        .send(booking)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          if (err) {
            throw err;
          }

          res.should.have.status(200);
          res.body.should.be.an("object");
          res.body.should.have.property("id");
          res.body.should.have.property("description");
          res.body.should.have.property("room_id");
          res.body.should.have.property("start");
          res.body.should.have.property("end");
          res.body.should.have.property("user_id");
          res.body.should.have.property("event_id");
          res.body.should.have.property("updated_at");
          res.body.should.have.property("created_at");
          res.body.description.should.equal("This is a booking to edit x2");
          res.body.room_id.should.equal(1);
          res.body.start.should.equal("2019-02-11T10:00:00.000Z");
          res.body.end.should.equal("2019-02-11T10:10:00.000Z");
          done();
        });
    });
    it("Should edit a booking. Edge case: start time.", done => {
      const booking = {
        description: "This is a booking to edit x3",
        room_id: 1,
        start: "2019-02-11T10:45:00",
        end: "2019-02-11T10:50:00",
        attendees: []
      };
      chai
        .request(server)
        .put(apiPath + bookingsId[0])
        .send(booking)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          if (err) {
            throw err;
          }

          res.should.have.status(200);
          res.body.should.be.an("object");
          res.body.should.have.property("id");
          res.body.should.have.property("description");
          res.body.should.have.property("room_id");
          res.body.should.have.property("start");
          res.body.should.have.property("end");
          res.body.should.have.property("user_id");
          res.body.should.have.property("event_id");
          res.body.should.have.property("updated_at");
          res.body.should.have.property("created_at");
          res.body.description.should.deep.equal(
            "This is a booking to edit x3"
          );
          res.body.room_id.should.deep.equal(1);
          res.body.start.should.deep.equal("2019-02-11T10:45:00.000Z");
          res.body.end.should.deep.equal("2019-02-11T10:50:00.000Z");
          done();
        });
    });
    it("Should edit a booking. Edge case: end time.", done => {
      const booking = {
        description: "This is a booking to edit x4",
        room_id: 1,
        start: "2019-02-11T10:00:00",
        end: "2019-02-11T10:30:00",
        attendees: []
      };
      chai
        .request(server)
        .put(apiPath + bookingsId[0])
        .send(booking)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          if (err) {
            throw err;
          }

          res.should.have.status(200);
          res.body.should.be.an("object");
          res.body.should.have.property("id");
          res.body.should.have.property("description");
          res.body.should.have.property("room_id");
          res.body.should.have.property("start");
          res.body.should.have.property("end");
          res.body.should.have.property("user_id");
          res.body.should.have.property("event_id");
          res.body.should.have.property("updated_at");
          res.body.should.have.property("created_at");
          res.body.description.should.deep.equal(
            "This is a booking to edit x4"
          );
          res.body.room_id.should.deep.equal(1);
          res.body.start.should.deep.equal("2019-02-11T10:00:00.000Z");
          res.body.end.should.deep.equal("2019-02-11T10:30:00.000Z");
          done();
        });
    });
    it("Try to reschedule in a reserved date.", done => {
      const booking = {
        description: "Call Varma",
        room_id: 1,
        start: "2019-02-11T10:35:00",
        end: "2019-02-11T10:40:00",
        attendees: []
      };

      chai
        .request(server)
        .put(apiPath + bookingsId[0])
        .send(booking)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(204);
          done();
        });
    });
    it("Try to reschedule with time out of office", done => {
      const booking = {
        description: "Call Varma",
        room_id: 1,
        start: "2019-04-15T06:00:00",
        end: "2019-04-15T09:00:00",
        attendees: []
      };

      chai
        .request(server)
        .put(apiPath + bookingsId[0])
        .send(booking)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.deep.equal(
            "bad Request: The booking only can have office hours (Monday-Friday, 8AM-6PM)."
          );
          done();
        });
    });
    it("Try to reschedule in weekend", done => {
      const booking = {
        description: "Call Varma",
        room_id: 1,
        start: "2019-12-14T12:00:00",
        end: "2019-12-14T13:00:00",
        attendees: []
      };

      chai
        .request(server)
        .put(apiPath + bookingsId[0])
        .send(booking)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.deep.equal(
            "bad Request: The booking only can have office hours (Monday-Friday, 8AM-6PM)."
          );
          done();
        });
    });
    it("Try to reschedule a meeting with a past date", done => {
      const booking = {
        description: "Call Varma",
        room_id: 1,
        start: "2019-01-08T12:00:00",
        end: "2019-01-08T13:00:00",
        attendees: []
      };

      chai
        .request(server)
        .put(apiPath + bookingsId[0])
        .send(booking)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.equal(
            "bad Request: Bookings in past dates aren't allowed."
          );
          done();
        });
    });
    it("Try to reschedule a meeting with invalid email", done => {
      const booking = {
        description: "Call Varma",
        room_id: 1,
        start: "2019-01-30T12:00:00",
        end: "2019-01-30T13:00:00",
        attendees: ["invalid@email"]
      };

      chai
        .request(server)
        .put(apiPath + bookingsId[0])
        .send(booking)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.deep.equal("Bad Request: Invalid email.");
          done();
        });
    });
    it("Try to reschedule a meeting without start date", done => {
      const booking = {
        description: "Call Varma",
        room_id: 1,
        start: "",
        end: "2019-01-30T13:00:00",
        attendees: []
      };

      chai
        .request(server)
        .put(apiPath + bookingsId[0])
        .send(booking)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.deep.equal("Bad Request: No start date in request.");
          done();
        });
    });
    it("Try to reschedule a meeting without end date", done => {
      const booking = {
        description: "Call Varma",
        room_id: 1,
        start: "2019-01-30T12:00:00",
        end: "",
        attendees: []
      };

      chai
        .request(server)
        .put(apiPath + bookingsId[0])
        .send(booking)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.deep.equal("Bad Request: No end date in request.");
          done();
        });
    });
    it("Try to reschedule a meeting without description", done => {
      const booking = {
        description: "",
        room_id: 1,
        start: "2019-01-30T12:00:00",
        end: "2019-01-30T13:00:00",
        attendees: []
      };

      chai
        .request(server)
        .put(apiPath + bookingsId[0])
        .send(booking)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.equal("Bad Request: No description in request.");
          done();
        });
    });
    it("Try to reschedule a meeting without roomId", done => {
      const booking = {
        description: "Call Varma",
        start: "2019-01-30T12:00:00",
        end: "2019-01-30T13:00:00",
        attendees: []
      };

      chai
        .request(server)
        .put(apiPath + bookingsId[0])
        .send(booking)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.equal("Bad Request: No roomId in request.");
          done();
        });
    });
    it("Try to reschedule a meeting with non-exist roomId", done => {
      const booking = {
        description: "Call Varma",
        roomId: 99,
        start: "2019-01-30T12:00:00",
        end: "2019-01-30T13:00:00",
        attendees: []
      };

      chai
        .request(server)
        .put(apiPath + bookingsId[0])
        .send(booking)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.deep.equal(
            `Bad Request: room ${booking.roomId} not exist.`
          );
          done();
        });
    });
  });

  describe("DELETE", () => {
    const bookingsId = [];
    // Create a bookings useful for testing
    before(async () => {
      const booking = {
        description: "This a booking useful for test cases",
        room_id: 1,
        start: "2019-02-11T10:30:00",
        end: "2019-02-11T10:45:00",
        attendees: []
      };

      // create a booking to edit
      const createdBooking = await chai
        .request(server)
        .post(apiPath)
        .send(booking)
        .set("Authorization", `Bearer ${token}`);

      const parsedBooking = JSON.parse(JSON.stringify(createdBooking));

      bookingsId.push(JSON.parse(parsedBooking.text).id);
    });

    it("Should delete a booking", done => {
      chai
        .request(server)
        .delete(apiPath + bookingsId[0])
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(204);
          done();
        });
    });
    it("Try to delete a non-exist booking", done => {
      chai
        .request(server)
        .delete(apiPath + bookingsId[0])
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.deep.equal("Not Found");
          done();
        });
    });
  });

  //describe("GET", () => {
  //  it("Should get all bookings", done => {
  //    done();
  //  });
  //  it("Should get all but not exist anything", done => {
  //    done();
  //  });
  //});
});
