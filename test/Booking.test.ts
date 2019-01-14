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
    it("it should post a booking", done => {
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
          done();
        });
    });
  });

  describe("POST", () => {
    it("The user tries to schedule a meeting with a past date.", done => {
      const booking = {
        description: "Call Varma",
        room_id: 1,
        start: "2019-01-08T12:00:00",
        end: "2018-01-08T13:00:00",
        attendees: []
      };

      chai
        .request(server)
        .post(apiPath)
        .send(booking)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(400);

          done();
        });
    });
  });
});
