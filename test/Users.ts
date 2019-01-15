// During the test the env variable is set to test
process.env.NODE_ENV = "test";
require("dotenv").config();

// Import DB setup and models
import { db } from "../app/db";
import { User } from "../app/models/User";

// Import the dev-dependencies
import * as chai from "chai";
import chaiHttp = require("chai-http");
let should = chai.should();
chai.use(chaiHttp);

const apiPath = "http://localhost:8888/api/v1/User/";

describe("User", () => {
  let token = "Bearer ";
  let userId = "";

  before(async function() {
    // Before testing it is convenient to create a new user..
    const testUser = {
      email: "testuser@test.com",
      password: "12345678",
      role: "admin"
    };
    await db.sync();
    const createdUser: any = await User.create(testUser);
    userId = createdUser.id.toString();

    // Log in once as administrator
    // Could be any request library...
    const credentials = await chai
      .request("http://localhost:8888/api/v1/auth/")
      .post("/login")
      .type("form")
      .send({
        email: "admin@example.com",
        password: "adminadmin"
      });
    token = token.concat(credentials.body.token);
  });

  after(async function() {
    // Delete user if it still exists after the delete test.
    const user: any = await User.findOne({
      where: { id: userId }
    });
    if (user) {
      await User.destroy({ where: { id: userId } });
    }
    await db.close();
  });

  /*
   * Test the /GET route
   */
  describe("GET", () => {
    it("it should get the user", done => {
      chai
        .request(apiPath)
        .get(userId)
        .set("Authorization", token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an("object");
          res.body.should.have.property("id");
          res.body.should.have.property("auth_provider_id");
          res.body.should.have.property("picture");
          res.body.should.have.property("name");
          res.body.should.have.property("email");
          done();

          if (err) {
            throw err;
          }
        });
    });

    it("it should not get the user if it does not exist", done => {
      chai
        .request(apiPath)
        .get("100")
        .set("Authorization", token)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.an("string").and.equal("Not Found");
          done();

          if (err) {
            throw err;
          }
        });
    });

    it("it should not get the user if token is not correct", done => {
      chai
        .request(apiPath)
        .get(userId)
        .set("Authorization", "")
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an("object").and.deep.equal({
            message: "jwt must be provided",
            name: "JsonWebTokenError"
          });
          done();

          if (err) {
            throw err;
          }
        });
    });

    it("it should not get the user if token is not provided", done => {
      chai
        .request(apiPath)
        .get(userId)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an("string").and.equal("No Token Present");
          done();

          if (err) {
            throw err;
          }
        });
    });
  });

  /*
   * Test the /PUT route
   */
  describe("PUT", () => {
    it("it should edit the user", done => {
      chai
        .request(apiPath)
        .put(userId)
        .type("form")
        .send({
          email: "testEdited@test.com",
          name: "testEdited",
          password: "test1234",
          picture: "newURL",
          role: "admin"
        })
        .set("Authorization", token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an("object");
          res.body.should.have.property("id");
          res.body.should.have.property("authProviderId");
          res.body.should.have.property("picture");
          res.body.should.have.property("name");
          res.body.should.have.property("email");
          done();

          if (err) {
            throw err;
          }
        });
    });

    it("it should not edit the user if it does not exist", done => {
      chai
        .request(apiPath)
        .put("100")
        .type("form")
        .send({
          email: "testEdited@test.com",
          name: "testEdited",
          password: "test1234",
          picture: "newURL",
          role: "admin"
        })
        .set("Authorization", token)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.an("object").and.deep.equal({});
          done();

          if (err) {
            throw err;
          }
        });
    });

    it("it should not edit the user if token is not correct", done => {
      chai
        .request(apiPath)
        .put(userId)
        .type("form")
        .send({
          email: "testEdited@test.com",
          name: "testEdited",
          password: "test1234",
          picture: "newURL",
          role: "admin"
        })
        .set("Authorization", "")
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an("object").and.deep.equal({
            message: "jwt must be provided",
            name: "JsonWebTokenError"
          });
          done();

          if (err) {
            throw err;
          }
        });
    });

    it("it should not edit the user if token is not provided", done => {
      chai
        .request(apiPath)
        .put(userId)
        .type("form")
        .send({
          email: "testEdited@test.com",
          name: "testEdited",
          password: "test1234",
          picture: "newURL",
          role: "admin"
        })
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an("string").and.equal("No Token Present");
          done();

          if (err) {
            throw err;
          }
        });
    });
  });

  /*
   * Test the /DELETE route
   */
  describe("DELETE", () => {
    it("it should delete the user", done => {
      chai
        .request(apiPath)
        .delete(userId)
        .set("Authorization", token)
        .end((err, res) => {
          res.should.have.status(204);
          res.body.should.be.an("object");
          done();

          if (err) {
            throw err;
          }
        });
    });

    it("it should not delete the user if it does not exist", done => {
      chai
        .request(apiPath)
        .delete(userId)
        .set("Authorization", token)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.an("object").and.deep.equal({});
          done();

          if (err) {
            throw err;
          }
        });
    });

    it("it should not delete the user if token is not correct", done => {
      chai
        .request(apiPath)
        .delete(userId)
        .set("Authorization", "")
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an("object").and.deep.equal({
            message: "jwt must be provided",
            name: "JsonWebTokenError"
          });
          done();

          if (err) {
            throw err;
          }
        });
    });

    it("it should not delete the user if token is not provided", done => {
      chai
        .request(apiPath)
        .delete(userId)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an("string").and.equal("No Token Present");
          done();

          if (err) {
            throw err;
          }
        });
    });
  });
});
