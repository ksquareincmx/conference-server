// During the test the env variable is set to test
process.env.NODE_ENV = "test";
require("dotenv").config();

// Import DB setup and models
import { db } from "../app/db";
import { Booking } from "../app/models/Booking";
import { Room } from "../app/models/Room";
import { User } from "../app/models/User";

// Import the dev-dependencies
import * as chai from "chai";
import chaiHttp = require("chai-http");
const should = chai.should();
chai.use(chaiHttp);

const apiPath = "/api/v1/booking/";
const server = "http://localhost:8888";

describe("Booking", () => {
  let token;
  let roomId;
  let userId;

  // create a room and user that be used in the testing
  before(async () => {
    // Create an room
    const testRoom = { name: "Conference 1", color: "Red" };
    const createdRoom: any = await Room.create(testRoom);
    roomId = createdRoom.id;

    // Create an user
    const testUser = {
      email: "conference.booking.test@gmail.com",
      password: "12345678"
    };
    const isConnectionOpen = !!db.authenticate();
    if (!isConnectionOpen) {
      await db.sync();
    }
    const createdUser: any = await User.create({ ...testUser, role: "admin" });

    // We need to do another query because before the profile wasn't ready
    const user: any = await User.findOne({
      where: { id: createdUser.id }
    });

    userId = user.id;

    // get credentials of the test user
    const credentials = await chai
      .request("http://localhost:8888/api/v1/auth/")
      .post("/login")
      .type("form")
      .send({
        email: "conference.booking.test@gmail.com",
        password: "12345678"
      });
    token = credentials.body.token;
  });

  // Delete room and user created for test
  after(async () => {
    await Room.destroy({ where: { id: roomId } });
    await User.destroy({ where: { id: userId } });
  });

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
        room_id: roomId,
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
          if (err) {
            throw err;
          }
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
          res.body.room_id.should.deep.equal(roomId);
          res.body.user_id.should.deep.equal(userId);
          res.body.start.should.deep.equal("2019-02-11T10:15:00.000Z");
          res.body.end.should.deep.equal("2019-02-11T10:30:00.000Z");
          bookingsId.push(res.body.id);
          console.log(res.body);
          done();
        });
    });
    it("Should post a booking. Edge case: start time", done => {
      const booking = {
        description: "Call Varma",
        room_id: roomId,
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
          if (err) {
            throw err;
          }

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
          res.body.room_id.should.deep.equal(roomId);
          res.body.start.should.deep.equal("2019-02-11T10:30:00.000Z");
          res.body.end.should.deep.equal("2019-02-11T10:45:00.000Z");
          bookingsId.push(res.body.id);
          done();
        });
    });
    it("Should post a booking. Edge case: end time", done => {
      const booking = {
        description: "Call Varma",
        room_id: roomId,
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
          if (err) {
            throw err;
          }

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
          res.body.room_id.should.deep.equal(roomId);
          res.body.start.should.deep.equal("2019-02-11T10:00:00.000Z");
          res.body.end.should.deep.equal("2019-02-11T10:15:00.000Z");
          bookingsId.push(res.body.id);
          done();
        });
    });
    it("Try to schedule in a reserved date.", done => {
      const booking = {
        description: "Call Varma",
        room_id: roomId,
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
          if (err) {
            throw err;
          }

          res.should.have.status(204);
          done();
        });
    });
    it("Try to schedule with time out of office.", done => {
      const booking = {
        description: "Call Varma",
        room_id: roomId,
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
          if (err) {
            throw err;
          }

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
        room_id: roomId,
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
          if (err) {
            throw err;
          }

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
        room_id: roomId,
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
          if (err) {
            throw err;
          }

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
        room_id: roomId,
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
          if (err) {
            throw err;
          }

          res.should.have.status(400);
          res.body.should.equal("Bad Request: Invalid email.");
          done();
        });
    });
    it("Try to schedule a meeting without start date.", done => {
      const booking = {
        description: "Call Varma",
        room_id: roomId,
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
          if (err) {
            throw err;
          }

          res.should.have.status(400);
          res.body.should.equal("Bad Request: No start date in request.");
          done();
        });
    });
    it("Try to schedule a meeting without end date.", done => {
      const booking = {
        description: "Call Varma",
        room_id: roomId,
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
          if (err) {
            throw err;
          }

          res.should.have.status(400);
          res.body.should.equal("Bad Request: No end date in request.");
          done();
        });
    });
    it("Try to schedule a meeting without description.", done => {
      const booking = {
        description: "",
        room_id: roomId,
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
          if (err) {
            throw err;
          }

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
          if (err) {
            throw err;
          }

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
          if (err) {
            throw err;
          }

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
        room_id: roomId,
        start: "2019-02-11T10:15:00",
        end: "2019-02-11T10:25:00",
        attendees: []
      };

      const booking = {
        description: "This a booking useful for test cases",
        room_id: roomId,
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
    });

    it("Should edit a booking.", done => {
      const booking = {
        description: "This is a booking to edit x2",
        room_id: roomId,
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
          res.body.room_id.should.equal(roomId);
          res.body.start.should.equal("2019-02-11T10:00:00.000Z");
          res.body.end.should.equal("2019-02-11T10:10:00.000Z");
          done();
        });
    });
    it("Should edit a booking. Edge case: start time.", done => {
      const booking = {
        description: "This is a booking to edit x3",
        room_id: roomId,
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
          res.body.room_id.should.deep.equal(roomId);
          res.body.start.should.deep.equal("2019-02-11T10:45:00.000Z");
          res.body.end.should.deep.equal("2019-02-11T10:50:00.000Z");
          done();
        });
    });
    it("Should edit a booking. Edge case: end time.", done => {
      const booking = {
        description: "This is a booking to edit x4",
        room_id: roomId,
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
          res.body.room_id.should.deep.equal(roomId);
          res.body.start.should.deep.equal("2019-02-11T10:00:00.000Z");
          res.body.end.should.deep.equal("2019-02-11T10:30:00.000Z");
          done();
        });
    });
    it("Try to reschedule in a reserved date.", done => {
      const booking = {
        description: "Call Varma",
        room_id: roomId,
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
          if (err) {
            throw err;
          }

          res.should.have.status(204);
          done();
        });
    });
    it("Try to reschedule with time out of office", done => {
      const booking = {
        description: "Call Varma",
        room_id: roomId,
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
          if (err) {
            throw err;
          }

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
        room_id: roomId,
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
          if (err) {
            throw err;
          }

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
        room_id: roomId,
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
          if (err) {
            throw err;
          }

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
        room_id: roomId,
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
          if (err) {
            throw err;
          }

          res.should.have.status(400);
          res.body.should.deep.equal("Bad Request: Invalid email.");
          done();
        });
    });
    it("Try to reschedule a meeting without start date", done => {
      const booking = {
        description: "Call Varma",
        room_id: roomId,
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
          if (err) {
            throw err;
          }

          res.should.have.status(400);
          res.body.should.deep.equal("Bad Request: No start date in request.");
          done();
        });
    });
    it("Try to reschedule a meeting without end date", done => {
      const booking = {
        description: "Call Varma",
        room_id: roomId,
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
          if (err) {
            throw err;
          }

          res.should.have.status(400);
          res.body.should.deep.equal("Bad Request: No end date in request.");
          done();
        });
    });
    it("Try to reschedule a meeting without description", done => {
      const booking = {
        description: "",
        room_id: roomId,
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
          if (err) {
            throw err;
          }

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
          if (err) {
            throw err;
          }

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
          if (err) {
            throw err;
          }

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
        room_id: roomId,
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
      console.log(parsedBooking);
      bookingsId.push(JSON.parse(parsedBooking.text).id);
      console.log(bookingsId);
    });

    it("Should delete a booking", done => {
      chai
        .request(server)
        .delete(apiPath + bookingsId[0])
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          if (err) {
            throw err;
          }

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
          if (err) {
            throw err;
          }

          res.should.have.status(404);
          res.body.should.deep.equal("Not Found");
          done();
        });
    });
  });

  describe("GET", () => {
    it("Should get all but not exist anything", done => {
      chai
        .request(server)
        .get(apiPath)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          if (err) {
            throw err;
          }

          res.should.have.status(200);
          res.body.should.be.an("array");
          res.body.should.have.length(0);
          done();
        });
    });

    describe("when bookings exist", () => {
      const bookingsId = [];
      const email = "conference.booking.test@gmail.com";

      // insert bookings in the db
      before(async () => {
        const bookings = [
          {
            description: "Call Varma",
            userId,
            roomId: roomId,
            start: "2019-02-11T10:15:00", // 2019-02-11T16:15:00
            end: "2019-02-11T10:30:00" // 2019-02-11T16:30:00
          },
          {
            description: "Call Varma x2",
            userId,
            roomId: roomId,
            start: "2019-02-11T12:10:00", // 2019-02-11T18:10:00
            end: "2019-02-11T12:30:00" // 2019-02-11T18:30:00
          },
          {
            description: "Call Varma x3",
            userId,
            roomId: roomId,
            start: "2019-03-11T10:15:00", // 2019-03-11T16:15:00
            end: "2019-03-11T10:30:00" // 2019-03-11T16:30:00
          }
        ];

        await db.sync();
        for (let booking of bookings) {
          const createdBooking: any = await Booking.create(booking);
          bookingsId.push(createdBooking.id.toString());
        }
      });

      // delete the booking from the db
      after(async () => {
        for (let id of bookingsId) {
          const booking: any = await Booking.findById(id);
          if (booking) {
            await Booking.destroy({ where: { id } });
          }
        }
      });

      it("Should get all bookings", done => {
        chai
          .request(server)
          .get(apiPath)
          .set("Authorization", `Bearer ${token}`)
          .end((err, res) => {
            if (err) {
              throw err;
            }
            res.should.have.status(200);
            res.body.should.be.an("array");

            res.body.forEach((booking, index) => {
              res.body[index].should.have.property("id");
              res.body[index].should.have.property("description");
              res.body[index].should.have.property("room_id");
              res.body[index].should.have.property("start");
              res.body[index].should.have.property("end");
              res.body[index].should.have.property("user_id");
              res.body[index].should.have.property("event_id");
              res.body[index].should.have.property("updated_at");
              res.body[index].should.have.property("created_at");
            });

            //Six hours more. Because timezone format when insert in the db
            // check body from booking[0]
            res.body[0].description.should.deep.equal("Call Varma");
            res.body[0].room_id.should.deep.equal(roomId);
            res.body[0].user_id.should.deep.equal(userId);
            res.body[0].start.should.deep.equal("2019-02-11T16:15:00.000Z");
            res.body[0].end.should.deep.equal("2019-02-11T16:30:00.000Z");

            // check body from booking[1]
            res.body[1].description.should.deep.equal("Call Varma x2");
            res.body[1].room_id.should.deep.equal(roomId);
            res.body[1].user_id.should.deep.equal(userId);
            res.body[1].start.should.deep.equal("2019-02-11T18:10:00.000Z");
            res.body[1].end.should.deep.equal("2019-02-11T18:30:00.000Z");

            // check body from booking[2]
            res.body[2].description.should.deep.equal("Call Varma x3");
            res.body[2].room_id.should.deep.equal(roomId);
            res.body[2].user_id.should.deep.equal(userId);
            res.body[2].start.should.deep.equal("2019-03-11T16:15:00.000Z");
            res.body[2].end.should.deep.equal("2019-03-11T16:30:00.000Z");

            done();
          });
      });
      it("Should get one booking", done => {
        chai
          .request(server)
          .get(apiPath + bookingsId[0])
          .set("Authorization", `Bearer ${token}`)
          .end((err, res) => {
            if (err) {
              throw err;
            }
            res.body.should.have.property("id");
            res.body.should.have.property("description");
            res.body.should.have.property("room_id");
            res.body.should.have.property("start");
            res.body.should.have.property("end");
            res.body.should.have.property("user_id");
            res.body.should.have.property("event_id");
            res.body.should.have.property("updated_at");
            res.body.should.have.property("created_at");

            res.body.description.should.deep.equal("Call Varma");
            res.body.room_id.should.deep.equal(roomId);
            res.body.user_id.should.deep.equal(userId);
            res.body.start.should.deep.equal("2019-02-11T16:15:00.000Z");
            res.body.end.should.deep.equal("2019-02-11T16:30:00.000Z");
            done();
          });
      });
      it("Should get bookings fromDate", done => {
        chai
          .request(server)
          .get(apiPath + "?fromDate=2019-03-11")
          .set("Authorization", `Bearer ${token}`)
          .end((err, res) => {
            if (err) {
              throw err;
            }
            res.should.have.status(200);
            res.body.should.be.an("array");
            res.body.should.have.length(1);

            res.body[0].should.be.an("object");
            res.body[0].should.have.property("id");
            res.body[0].should.have.property("description");
            res.body[0].should.have.property("room_id");
            res.body[0].should.have.property("start");
            res.body[0].should.have.property("end");
            res.body[0].should.have.property("user_id");
            res.body[0].should.have.property("event_id");
            res.body[0].should.have.property("updated_at");
            res.body[0].should.have.property("created_at");

            res.body[0].description.should.deep.equal("Call Varma x3");
            res.body[0].room_id.should.deep.equal(roomId);
            res.body[0].user_id.should.deep.equal(userId);
            res.body[0].start.should.deep.equal("2019-03-11T16:15:00.000Z");
            res.body[0].end.should.deep.equal("2019-03-11T16:30:00.000Z");

            done();
          });
      });
      it("Should get bookings toDate", done => {
        chai
          .request(server)
          .get(apiPath + "?toDate=2019-02-11T17:00")
          .set("Authorization", `Bearer ${token}`)
          .end((err, res) => {
            if (err) {
              throw err;
            }
            res.should.have.status(200);
            res.body.should.be.an("array");
            res.body.should.have.length(1);

            res.body[0].should.be.an("object");
            res.body[0].should.have.property("id");
            res.body[0].should.have.property("description");
            res.body[0].should.have.property("room_id");
            res.body[0].should.have.property("start");
            res.body[0].should.have.property("end");
            res.body[0].should.have.property("user_id");
            res.body[0].should.have.property("event_id");
            res.body[0].should.have.property("updated_at");
            res.body[0].should.have.property("created_at");

            res.body[0].description.should.deep.equal("Call Varma");
            res.body[0].room_id.should.deep.equal(roomId);
            res.body[0].user_id.should.deep.equal(userId);
            res.body[0].start.should.deep.equal("2019-02-11T16:15:00.000Z");
            res.body[0].end.should.deep.equal("2019-02-11T16:30:00.000Z");

            done();
          });
      });
      it("Should get bookings fromDate to toDate", done => {
        chai
          .request(server)
          .get(apiPath + "?fromDate=2019-02-11T16:31:00&toDate=2019-03-10")
          .set("Authorization", `Bearer ${token}`)
          .end((err, res) => {
            if (err) {
              throw err;
            }
            res.should.have.status(200);
            res.body.should.be.an("array");
            res.body.should.have.length(1);

            res.body[0].should.be.an("object");
            res.body[0].should.have.property("id");
            res.body[0].should.have.property("description");
            res.body[0].should.have.property("room_id");
            res.body[0].should.have.property("start");
            res.body[0].should.have.property("end");
            res.body[0].should.have.property("user_id");
            res.body[0].should.have.property("event_id");
            res.body[0].should.have.property("updated_at");
            res.body[0].should.have.property("created_at");

            res.body[0].description.should.deep.equal("Call Varma x2");
            res.body[0].room_id.should.deep.equal(roomId);
            res.body[0].user_id.should.deep.equal(userId);
            res.body[0].start.should.deep.equal("2019-02-11T18:10:00.000Z");
            res.body[0].end.should.deep.equal("2019-02-11T18:30:00.000Z");

            done();
          });
      });
      it("Try to get bookings with incorrect fromDate", done => {
        chai
          .request(server)
          .get(apiPath + "?fromDate=assadsad")
          .set("Authorization", `Bearer ${token}`)
          .end((err, res) => {
            if (err) {
              throw err;
            }

            res.should.have.status(400);
            res.body.should.equal(
              "Bad Request: fromDate must be a date in format YYYY-MM-DDTHH:MM."
            );
            done();
          });
      });
      it("Try to get bookigns with incorrect toDate", done => {
        chai
          .request(server)
          .get(apiPath + "?toDate=assadsad")
          .set("Authorization", `Bearer ${token}`)
          .end((err, res) => {
            if (err) {
              throw err;
            }

            res.should.have.status(400);
            res.body.should.equal(
              "Bad Request: toDate must be a date in format YYYY-MM-DDTHH:MM."
            );
            done();
          });
      });
    });
  });
});
