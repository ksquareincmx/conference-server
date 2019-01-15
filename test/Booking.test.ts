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

      await db.close();
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
        attendees: ["invalid@email"]
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
  describe("PUT", () => {});
  describe("GET", () => {
    it("Should get all bookings");
    it("Should get all but not exist anaything");
    it("Should get all but not exist anaything");
  });
  describe("DELETE", () => {
    it("Should cancel a booking", done => {});
    it("Try to cancel a past booking", done => {});
    it("Try to cancel a innexist booking", done => {});
  });
});
