// During the test the env variable is set to test
process.env.NODE_ENV = "test";
require("dotenv").config();

// Import DB setup and models
import { db } from "../app/db";
import { User } from "../app/models/User";
import { Room } from "../app/models/Room";


// Import the dev-dependencies
import * as chai from "chai";
import chaiHttp = require("chai-http");
let should = chai.should();
chai.use(chaiHttp);

const apiPath = "http://localhost:8888/api/v1/Room/";

describe("Room", () => {
  let token: string;
  let blackListedToken: string;
  let userId: string;
  let roomId: string;
  const testRoom = {
    name: "Test Room",
    color: "Test Color",
    presence: false
  }	;

  before(async function() {
    // Before testing it is convenient to create a new user..
    const testUser = {
      email: "testuser@test.com",
      password: "12345678",
      role: "admin"
    };
    const isConnectionOpen = !!db.authenticate();
    if (!isConnectionOpen) { await db.sync(); }
    const createdUser: any = await User.create(testUser);
    userId = createdUser.id.toString();

    // Create test room

    const createdRoom: any = await Room.create(testRoom);
    roomId = createdRoom.id.toString();

    // Log in once as administrator
    // Could be any request library...
    const expiredCredentials = await chai.request("http://localhost:8888/api/v1/auth/")
      .post("/login")
      .type("form")
      .send(testUser)
    blackListedToken = `Bearer ${expiredCredentials.body.token}`;

    // Logout to invalidate credentials
    await chai.request("http://localhost:8888/api/v1/auth/")
      .post("/logout")
      .type("form")
      .set("Authorization", blackListedToken)
      .send(testUser)

    // Login to get new credentials
    const credentials = await chai.request("http://localhost:8888/api/v1/auth/")
      .post("/login")
      .type("form")
      .send(testUser)
    token =  `Bearer ${credentials.body.token}`;

  });

  after(async function() {
    // Delete user if it still exists after the delete test.
    const user: any = await User.findOne({
      where: { id: userId }
      // include: [{ model: Profile, as: "profile" }]
    });
    if (user) {
      await User.destroy({where: { id: userId }});
      await Room.destroy({where: { id: roomId }});
    }
    // await db.close();
  });

  /*
  * Test the /GET route
  */
  describe("GET", () => {
    it("it should get the room", (done) => {
      chai.request(apiPath)
          .get(roomId)
          .set("Authorization", token)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.an("object");
            res.body.should.have.property("id");
            res.body.should.have.property("name");
            res.body.should.have.property("color");
            res.body.should.have.property("presence");
            res.body.should.have.property("updated_at");
            res.body.should.have.property("created_at");
            done();
          });
    });

    it("it should not get the room if it does not exist", (done) => {
      chai.request(apiPath)
          .get("100")
          .set("Authorization", token)
          .end((err, res) => {
            res.should.have.status(404);
            res.body.should.be.an("string").and.equal("Not Found");
            done();
          });
    });

    it("it should not get the room if token is not correct", (done) => {
      chai.request(apiPath)
          .get(roomId)
          .set("Authorization", "")
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.be.an("object").and.deep.equal({
              message: "jwt must be provided",
              name: "JsonWebTokenError"
            });
            done();
          });
    });

    it("it should not get the room if token is not provided", (done) => {
      chai.request(apiPath)
          .get(roomId)
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.be.an("string").and.equal("No Token Present");
            done();
          });
    });

    it("it should not get the room if token is blacklisted", (done) => {
      chai.request(apiPath)
          .get(roomId)
          .set("Authorization", blackListedToken)
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.be.an("object").and.deep.equal({
              name: "Error",
              message: "This Token is blacklisted"
            });
            done();
          });
    });
  });

  /*
  * Test the /POST route
  */
  describe("POST", () => {
    const createdRoom = {
      name: "Created Room",
      color: "Created Color",
      presence: true
    };

    after(async function() {
      // Delete the created room.
      const room: any = await Room.findOne({
        where: createdRoom
      });
      if (room) {
        await Room.destroy({where: { id: room.id }});
      }
    });

    it("it should create a new room", (done) => {
      chai.request(apiPath)
          .post("")
          .type("form")
          .send(createdRoom)
          .set("Authorization", token)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.an("object");
            res.body.should.have.property("id");
            res.body.should.have.property("name");
            res.body.should.have.property("color");
            res.body.should.have.property("presence");
            res.body.should.have.property("updated_at");
            res.body.should.have.property("created_at");
            done();
          });
    });

    it("it should not create a new room if name and color are not unique", (done) => {
      chai.request(apiPath)
          .post("")
          .type("form")
          .send(testRoom)
          .set("Authorization", token)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a("string").and.equal("Bad Request: name and color must be uniques")
            done();
          });
    });

    it("it should not create a new room if token is not correct", (done) => {
      chai.request(apiPath)
          .post("")
          .type("form")
          .send(createdRoom)
          .set("Authorization", "")
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.be.an("object").and.deep.equal({
              message: "jwt must be provided",
              name: "JsonWebTokenError"
            });
            done();
          });
    });

    it("it should not create a new room if token is not provided", (done) => {
      chai.request(apiPath)
          .post("")
          .type("form")
          .send(createdRoom)
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.be.an("string").and.equal("No Token Present");
            done();
          });
    });

    it("it should not create a new room if token is blacklisted", (done) => {
      chai.request(apiPath)
          .post("")
          .type("form")
          .send(createdRoom)
          .set("Authorization", blackListedToken)
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.be.an("object").and.deep.equal({
              name: "Error",
              message: "This Token is blacklisted"
            });
            done();
          });
    });
  });

  /*
  * Test the /PUT route
  */
  describe("PUT", () => {
    const editedRoom = {
      name: "Edited Room",
      color: "Edited Color",
      presence: true
    }

    it("it should edit the room", (done) => {
      chai.request(apiPath)
          .put(roomId)
          .type("form")
          .send(editedRoom)
          .set("Authorization", token)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.an("object");
            res.body.should.have.property("id");
            res.body.should.have.property("name");
            res.body.should.have.property("color");
            res.body.should.have.property("presence");
            res.body.should.have.property("updated_at");
            res.body.should.have.property("created_at");
            done();
          });
    });

    it("it should not edit the room if it does not exist", (done) => {
      chai.request(apiPath)
          .put("100")
          .type("form")
          .send({
            name: "originalName",
            color: "originalColor"
          })
          .set("Authorization", token)
          .end((err, res) => {
            res.should.have.status(500); // Internal Server Error
            // res.body.should.be.an("string").and.equal("Not Found");
            res.body.should.be.an("object").and.deep.equal({});
            done();
          });
    });

    it("it should not edit the room if token is not correct", (done) => {
      chai.request(apiPath)
          .put(roomId)
          .type("form")
          .send(editedRoom)
          .set("Authorization", "")
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.be.an("object").and.deep.equal({
              message: "jwt must be provided",
              name: "JsonWebTokenError"
            });
            done();
          });
    });

    it("it should not edit the room if token is not provided", (done) => {
      chai.request(apiPath)
          .put(roomId)
          .type("form")
          .send(editedRoom)
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.be.an("string").and.equal("No Token Present");
            done();
          });
    });

    it("it should not edit the room if token is blacklisted", (done) => {
      chai.request(apiPath)
          .put(roomId)
          .type("form")
          .send(editedRoom)
          .set("Authorization", blackListedToken)
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.be.an("object").and.deep.equal({
              name: "Error",
              message: "This Token is blacklisted"
            });
            done();
          });
    });
  });

  /*
  * Test the /DELETE route
  */
  describe("DELETE", () => {
    it("it should delete the room", (done) => {
      chai.request(apiPath)
          .delete(roomId)
          .set("Authorization", token)
          .end((err, res) => {
            res.should.have.status(204);
            res.body.should.be.an("object");
            done();
          });
    });

    it("it should not delete the room if it does not exist", (done) => {
      chai.request(apiPath)
          .delete(roomId)
          .set("Authorization", token)
          .end((err, res) => {
            res.should.have.status(404);
            // res.body.should.be.an("string").and.equal("Not Found");
            res.body.should.be.an("object").and.deep.equal({});
            done();
          });
    });

    it("it should not delete the room if token is not correct", (done) => {
      chai.request(apiPath)
          .delete(roomId)
          .set("Authorization", "")
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.be.an("object").and.deep.equal({
              message: "jwt must be provided",
              name: "JsonWebTokenError"
            });
            done();
          });
    });

    it("it should not delete the room if token is not provided", (done) => {
      chai.request(apiPath)
          .delete(roomId)
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.be.an("string").and.equal("No Token Present");
            done();
          });
    });

    it("it should not delete the room if token is blacklisted", (done) => {
      chai.request(apiPath)
          .delete(roomId)
          .set("Authorization", blackListedToken)
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.be.an("object").and.deep.equal({
              name: "Error",
              message: "This Token is blacklisted"
            });
            done();
          });
    });
  });
});