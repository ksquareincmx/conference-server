
// Import DB setup and models
import { chai, Credentials, UserData } from "../common";

const apiPath = "http://localhost:8888/api/v1/Profile/";

export const profileTest = (params: Credentials, user: UserData) => {
  describe("Profile", () => {

    /*
    * Test the /GET route
    */
    describe("GET", () => {
      it("it should get the given profile", (done) => {
        chai.request(apiPath)
            .get(user.profileId)
            .set("Authorization", params.token)
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

      it("it should not get the profile if it does not exist", (done) => {
        chai.request(apiPath)
            .get("100")
            .set("Authorization", params.token)
            .end((err, res) => {
              res.should.have.status(404);
              res.body.should.be.an("string").and.equal("Not Found");
              done();
            });
      });

      it("it should not get the profile if params.token is not correct", (done) => {
        chai.request(apiPath)
            .get(user.profileId)
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

      it("it should not get the profile if params.token is not provided", (done) => {
        chai.request(apiPath)
            .get(user.profileId)
            .end((err, res) => {
              res.should.have.status(401);
              res.body.should.be.an("string").and.equal("No Token Present");
              done();
            });
      });

      it("it should not get the profile if params.token is blacklisted", (done) => {
        chai.request(apiPath)
            .get(user.profileId)
            .set("Authorization", params.blackListedToken)
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
        locale: "en",
        // userId: userId
      };

      it("it should edit the  user profile", (done) => {
        chai.request(apiPath)
            .put(user.profileId)
            .type("form")
            .send(editedProfile)
            .set("Authorization", params.token)
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

      it("it should not edit the profile if it does not exist", (done) => {
        chai.request(apiPath)
            .put("100")
            .type("form")
            .send(editedProfile)
            .set("Authorization", params.token)
            .end((err, res) => {
              res.should.have.status(404);
              res.body.should.be.an("string").and.equal("Not Found");
              done();
            });
      });

      it("it should not edit the profile if params.token is not correct", (done) => {
        chai.request(apiPath)
            .put(user.profileId)
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

      it("it should not edit the profile if params.token is not provided", (done) => {
        chai.request(apiPath)
            .put(user.profileId)
            .type("form")
            .send(editedProfile)
            .end((err, res) => {
              res.should.have.status(401);
              res.body.should.be.an("string").and.equal("No Token Present");
              done();
            });
      });

      it("it should not edit the profile if params.token is blacklisted", (done) => {
        chai.request(apiPath)
            .put(user.profileId)
            .type("form")
            .send(editedProfile)
            .set("Authorization", params.blackListedToken)
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
};