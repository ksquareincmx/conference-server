// Import the dev-dependencies
import { chai, ICredential, IUserId, IUserLogin, User } from "../common";

const apiPath = "http://localhost:8888/api/v2/User/";

export const userTest = (auth: ICredential, user: IUserId) => {
  describe("User", () => {
    /*
     * Test the /GET route
     */
    describe("GET", () => {
      it("it should get the user", done => {
        chai
          .request(apiPath)
          .get(user.id)
          .set("Authorization", auth.token)
          .end((err, res) => {
            if (err) {
              throw err;
            }
            res.should.have.status(200);
            res.body.should.be.an("object");
            res.body.should.have.property("id");
            res.body.should.have.property("auth_provider_id");
            res.body.should.have.property("picture");
            res.body.should.have.property("name");
            res.body.should.have.property("email");
            done();
          });
      });

      it("it should not get the user if it does not exist", done => {
        chai
          .request(apiPath)
          .get("100")
          .set("Authorization", auth.token)
          .end((err, res) => {
            if (err) {
              throw err;
            }
            res.should.have.status(404);
            res.body.should.be.an("string").and.equal("Not Found");
            done();
          });
      });

      it("it should not get the user if auth.token is not correct", done => {
        chai
          .request(apiPath)
          .get(user.id)
          .set("Authorization", "")
          .end((err, res) => {
            if (err) {
              throw err;
            }
            res.should.have.status(401);
            res.body.should.be.an("object").and.deep.equal({
              message: "jwt must be provided",
              name: "JsonWebTokenError"
            });
            done();
          });
      });

      it("it should not get the user if auth.token is not provided", done => {
        chai
          .request(apiPath)
          .get(user.id)
          .end((err, res) => {
            if (err) {
              throw err;
            }
            res.should.have.status(401);
            res.body.should.be.an("string").and.equal("No Token Present");
            done();
          });
      });

      it("it should not get the user if auth.token is blacklisted", done => {
        chai
          .request(apiPath)
          .get(user.id)
          .set("Authorization", auth.blackListedToken)
          .end((err, res) => {
            if (err) {
              throw err;
            }
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
      const testEdited = {
        email: "testEdited@test.com",
        name: "testEdited",
        password: "test1234",
        picture: "newURL",
        role: "admin"
      };

      it("it should edit the user", done => {
        chai
          .request(apiPath)
          .put(user.id)
          .send(testEdited)
          .set("Authorization", auth.token)
          .end((err, res) => {
            if (err) {
              throw err;
            }
            res.should.have.status(200);
            res.body.should.be.an("object");
            res.body.should.have.property("id");
            res.body.should.have.property("authProviderId");
            res.body.should.have.property("picture");
            res.body.should.have.property("name");
            res.body.should.have.property("email");
            done();
          });
      });

      it("it should not edit the user if it does not exist", done => {
        chai
          .request(apiPath)
          .put("100")
          .send(testEdited)
          .set("Authorization", auth.token)
          .end((err, res) => {
            if (err) {
              throw err;
            }
            res.should.have.status(404);
            res.body.should.be.an("object").and.deep.equal({});
            done();
          });
      });

      it("it should not edit the user if auth.token is not correct", done => {
        chai
          .request(apiPath)
          .put(user.id)
          .send(testEdited)
          .set("Authorization", "")
          .end((err, res) => {
            if (err) {
              throw err;
            }
            res.should.have.status(401);
            res.body.should.be.an("object").and.deep.equal({
              message: "jwt must be provided",
              name: "JsonWebTokenError"
            });
            done();
          });
      });

      it("it should not edit the user if auth.token is not provided", done => {
        chai
          .request(apiPath)
          .put(user.id)
          .send(testEdited)
          .end((err, res) => {
            if (err) {
              throw err;
            }
            res.should.have.status(401);
            res.body.should.be.an("string").and.equal("No Token Present");
            done();
          });
      });

      it("it should not edit the user if auth.token is blacklisted", done => {
        chai
          .request(apiPath)
          .put(user.id)
          .send(testEdited)
          .set("Authorization", auth.blackListedToken)
          .end((err, res) => {
            if (err) {
              throw err;
            }
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
      let userId: string;
      const userToDelete: IUserLogin = {
        email: "deleteUser@test.com",
        password: "12345678"
      };

      before(async function() {
        try {
          const createdUser: any = await User.create({
            ...userToDelete,
            role: "admin"
          });
          userId = createdUser.id.toString();
        } catch (err) {
          throw err;
        }
      });

      after(async function() {
        try {
          // Delete user if it still exists after the delete test.
          const user: any = await User.findOne({
            where: { id: userId }
          });
          if (user) {
            await User.destroy({ where: { id: userId } });
          }
        } catch (err) {
          throw err;
        }
      });

      it("it should delete the user", done => {
        chai
          .request(apiPath)
          .delete(userId)
          .set("Authorization", auth.token)
          .end((err, res) => {
            if (err) {
              throw err;
            }
            res.should.have.status(204);
            res.body.should.be.an("object");
            done();
          });
      });

      it("it should not delete the user if it does not exist", done => {
        chai
          .request(apiPath)
          .delete(userId)
          .set("Authorization", auth.token)
          .end((err, res) => {
            if (err) {
              throw err;
            }
            res.should.have.status(404);
            // res.body.should.be.an("string").and.equal("Not Found");
            res.body.should.be.an("object").and.deep.equal({});
            done();
          });
      });

      it("it should not delete the user if auth.token is not correct", done => {
        chai
          .request(apiPath)
          .delete(userId)
          .set("Authorization", "")
          .end((err, res) => {
            if (err) {
              throw err;
            }
            res.should.have.status(401);
            res.body.should.be.an("object").and.deep.equal({
              message: "jwt must be provided",
              name: "JsonWebTokenError"
            });
            done();
          });
      });

      it("it should not delete the user if auth.token is not provided", done => {
        chai
          .request(apiPath)
          .delete(userId)
          .end((err, res) => {
            if (err) {
              throw err;
            }
            res.should.have.status(401);
            res.body.should.be.an("string").and.equal("No Token Present");
            done();
          });
      });

      it("it should not delete the user if auth.token is blacklisted", done => {
        chai
          .request(apiPath)
          .delete(userId)
          .set("Authorization", auth.blackListedToken)
          .end((err, res) => {
            if (err) {
              throw err;
            }
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
