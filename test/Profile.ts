// During the test the env variable is set to test
process.env.NODE_ENV = "test";
require("dotenv").config();

// Import DB setup and models
import { db } from "../app/db";
import { Profile } from "../app/models/Profile";
import { User } from "../app/models/User";

// Import the dev-dependencies
import * as chai from "chai";
import chaiHttp = require("chai-http");
let should = chai.should();
chai.use(chaiHttp);

const apiPath = "http://localhost:8888/api/v1/Profile/";

describe("Profile", () => {
  let token: string;
  let blackListedToken: string;
  let userId: string;
  let profileId: string;

  before(async function() {
    // Before testing it is convenient to create a new user..
    const testUser = {
      email: "test2@test.com",
      password: "12345678"
    };
    const isConnectionOpen = !!db.authenticate();
    if (!isConnectionOpen) {
      await db.sync();
    }
    const createdUser: any = await User.create({ ...testUser, role: "admin" });
    // const createdProfile: any = await Profile.create({
    //   time_zone: "asdasd/asdfsdf",
    //   locale: "en",
    //   userId: 1
    // });
    // We need to do another query because before the profile wasn't ready
    const user: any = await User.findOne({
      where: { id: createdUser.id },
      include: [{ model: Profile, as: "profile" }]
    });
    userId = createdUser.id.toString();
    profileId = user.profile.id.toString();

    // Log in once as administrator
    // Could be any request library...
    const expiredCredentials = await chai
      .request("http://localhost:8888/api/v1/auth/")
      .post("/login")
      .type("form")
      .send(testUser);
    blackListedToken = `Bearer ${expiredCredentials.body.token}`;

    // Logout to invalidate credentials
    await chai
      .request("http://localhost:8888/api/v1/auth/")
      .post("/logout")
      .type("form")
      .set("Authorization", blackListedToken)
      .send(testUser);

    // Login to get new credentials
    const credentials = await chai
      .request("http://localhost:8888/api/v1/auth/")
      .post("/login")
      .type("form")
      .send(testUser);
    token = `Bearer ${credentials.body.token}`;
  });

  after(async function() {
    // Delete user after all tests.
    const user: any = await User.findOne({
      where: { id: userId }
      // include: [{ model: Profile, as: "profile" }]
    });
    if (user) {
      await User.destroy({ where: { id: userId } });
    }
    // await db.close();
  });

  /*
   * Test the /GET route
   */
  describe("GET", () => {
    it("it should get the given profile", done => {
      chai
        .request(apiPath)
        .get(profileId)
        .set("Authorization", token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an("object");
          res.body.should.have.property("id");
          res.body.should.have.property("time_zone");
          res.body.should.have.property("locale");
          res.body.should.have.property("user_id");
          res.body.should.have.property("created_at");
          res.body.should.have.property("updated_at");
          done();
        });
    });

    it("it should not get the profile if it does not exist", done => {
      chai
        .request(apiPath)
        .get("100")
        .set("Authorization", token)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.an("string").and.equal("Not Found");
          done();
        });
    });

    it("it should not get the profile if token is not correct", done => {
      chai
        .request(apiPath)
        .get(profileId)
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

    it("it should not get the profile if token is not provided", done => {
      chai
        .request(apiPath)
        .get(profileId)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an("string").and.equal("No Token Present");
          done();
        });
    });

    it("it should not get the profile if token is blacklisted", done => {
      chai
        .request(apiPath)
        .get(profileId)
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
    const editedProfile = {
      timeZone: "edited/timezone",
      locale: "en"
      // userId: userId
    };

    it("it should edit the  user profile", done => {
      chai
        .request(apiPath)
        .put(profileId)
        .type("form")
        .send(editedProfile)
        .set("Authorization", token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an("object");
          res.body.should.have.property("id");
          res.body.should.have.property("time_zone");
          res.body.should.have.property("locale");
          res.body.should.have.property("user_id");
          res.body.should.have.property("created_at");
          res.body.should.have.property("updated_at");
          done();
        });
    });

    it("it should not edit the profile if it does not exist", done => {
      chai
        .request(apiPath)
        .put("100")
        .type("form")
        .send(editedProfile)
        .set("Authorization", token)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.an("string").and.equal("Not Found");
          done();
        });
    });

    it("it should not edit the profile if token is not correct", done => {
      chai
        .request(apiPath)
        .put(profileId)
        .type("form")
        .send(editedProfile)
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

    it("it should not edit the profile if token is not provided", done => {
      chai
        .request(apiPath)
        .put(profileId)
        .type("form")
        .send(editedProfile)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an("string").and.equal("No Token Present");
          done();
        });
    });

    it("it should not edit the profile if token is blacklisted", done => {
      chai
        .request(apiPath)
        .put(profileId)
        .type("form")
        .send(editedProfile)
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
