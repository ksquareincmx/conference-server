
import { chai, Credentials, User, UserData } from "../common";

const apiPath = "http://localhost:8888/api/v1/auth/";

export const authTest = (params: Credentials, user: UserData) => {
  describe("Auth", () => {
    let token: string;
    let refresh_token: string;
    let userId: string;
    const testUser = {
      email: "test@test.com",
      password: "12345678"
    };

    before(async function() {
      // Before testing it is convenient to create a new user..
      const createdUser: any = await User.create({...testUser, role: "admin"});
      userId = createdUser.id.toString();
      const credentials = await chai
        .request(apiPath)
        .post("/login")
        .type("form")
        .send(testUser);
      refresh_token = `Bearer ${credentials.body.refresh_token.token}`;
      token =  `Bearer ${credentials.body.token}`;
    });

    after(async function() {
      // Delete user if it still exists after the delete test.
      const user: any = await User.findOne({
        where: { id: userId }
        // include: [{ model: Profile, as: "profile" }]
      });
      if (user) {
        await User.destroy({ where: { id: userId } });
      }
    });

    /*
    * Test the /register route
    */
    describe("/register", () => {
      const registerUser = {
        email: "register@test.com",
        password: "12345678"
      };

      after(async function() {
        const user: any = await User.findOne({
          where: { email: registerUser.email }
        });
        if (user) {
          await User.destroy({ where: { id: user.id } });
        }
      });

      it("it should register a new user user", (done) => {
        chai
          .request(apiPath)
          .post("/register")
          .type("form")
          .send(registerUser)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.an("object");
            res.body.should.have.property("token");
            res.body.should.have.property("expires");
            res.body.should.have.property("refresh_token");
            res.body.should.have.property("user");
            res.body.should.have.property("profile");
            done();
          });
      });

      it("it should not register an email which is already in use", (done) => {
        chai
          .request(apiPath)
          .post("/register")
          .type("form")
          .send(testUser)
          .end((err, res) => {
            res.should.have.status(403);
            res.body.should.be.a("string").and.equal("email in use");
            done();
          });
      });

      it("it should not register a User if password length is less than 8", (done) => {
        chai
          .request(apiPath)
          .post("/register")
          .type("form")
          .send({
            ...registerUser,
            password: "1234567"
          })
          .end((err, res) => {
            res.should.have.status(500);
            done();
          });
      });
    });

    /*
    * Test the /login route
    */
    describe("/login", () => {
      it("it should login the user", (done) => {
        chai
          .request(apiPath)
          .post("/login")
          .type("form")
          .send(testUser)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.an("object");
            res.body.should.have.property("token");
            res.body.should.have.property("expires");
            res.body.should.have.property("refresh_token");
            res.body.should.have.property("user");
            res.body.should.have.property("profile");
            done();
          });
      });

      // it("it should not login if email is not registered", (done) => {
      //   chai.request(apiPath)
      //       .post("/login")
      //       .type("form")
      //       .send({
      //         email: "somthing@test.com",
      //         password: "12345678"
      //       })
      //       .end((err, res) => {
      //         res.should.have.status(403);
      //         res.body.should.be.a("string").and.equal("email not registered");
      //         done();
      //       });
      // });

      it("it should not login if password is incorrect", (done) => {
        chai
          .request(apiPath)
          .post("/login")
          .type("form")
          .send({
            ...testUser,
            password: "1234567"
          })
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.be.a("string").and.equal("Unauthorized");
            done();
          });
      });

      // it("it should not login if params are invalid", (done) => {
      //   chai.request(apiPath)
      //       .post("/register")
      //       .type("form")
      //       .send({
      //         email: "notRegistered@test.com",
      //         password: "12345678"
      //       })
      //       .end((err, res) => {
      //         res.should.have.status(403);
      //         res.body.should.be.a("string").and.equal("email in use");
      //         done();
      //       });
      // });
    });

    /*
    * Test the /logout route
    */
    describe("/logout", () => {
      it("it should logout the user", (done) => {
        chai
          .request(apiPath)
          .post("/logout")
          .type("form")
          .set("Authorization", token)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("string").and.equal("OK");
            done();
          });
      });

      it("it should not logout if token has already been blacklisted", (done) => {
        chai
          .request(apiPath)
          .post("/logout")
          .type("form")
          .set("Authorization", token)
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.be.an("object").and.deep.equal({
              name: "Error",
              message: "This Token is blacklisted"
            });
            done();
          });
      });

      it("it should not logout if token is not correct", (done) => {
        chai
          .request(apiPath)
          .post("/logout")
          .type("form")
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

      it("it should not logout if token is not provided", (done) => {
        chai
          .request(apiPath)
          .post("/logout")
          .type("form")
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.be.an("string").and.equal("No Token Present");
            done();
          });
      });
    });

    /*
    * Test the /change route
    */
    describe("/change", () => {

      before(async function() {
        // Redo Login in case of logout
        const credentials = await chai
          .request(apiPath)
          .post("/login")
          .type("form")
          .send(testUser);
        refresh_token = `Bearer ${credentials.body.refresh_token.token}`;
        token = `Bearer ${credentials.body.token}`;
      });

      it("it should change the password", (done) => {
        chai
          .request(apiPath)
          .post("/change")
          .type("form")
          .set("Authorization", token)
          .send({
            email: testUser.email,
            oldPass: testUser.password,
            newPass: "87654321"
          })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.an("object");
            res.body.should.have.property("token");
            res.body.should.have.property("expires");
            res.body.should.have.property("refresh_token");
            res.body.should.have.property("user");
            res.body.should.have.property("profile");
            done();
          });
      });

      it("it should not change the password if token is not correct", (done) => {
        chai
          .request(apiPath)
          .post("/change")
          .type("form")
          .set("Authorization", "")
          .send({
            email: testUser.email,
            oldPass: testUser.password,
            newPass: "87654321"
          })
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.be.an("object").and.deep.equal({
              message: "jwt must be provided",
              name: "JsonWebTokenError"
            });
            done();
          });
      });

      it("it should not change the password if token is not provided", (done) => {
        chai
          .request(apiPath)
          .post("/change")
          .type("form")
          .send({
            email: testUser.email,
            oldPass: testUser.password,
            newPass: "87654321"
          })
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.be.an("string").and.equal("No Token Present");
            done();
          });
      });
    });

    /*
    * Test the /refresh route
    */
    describe("/refresh", () => {
      it("it should refresh the token", (done) => {
        chai
          .request(apiPath)
          .post("/refresh")
          .type("form")
          .set("Authorization", refresh_token)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.an("object");
            res.body.should.have.property("token");
            res.body.should.have.property("expires");
            res.body.should.have.property("refresh_token");
            res.body.should.have.property("user");
            done();
          });
      });

      it("it should not refresh the token if token is not refresh_token", (done) => {
        chai
          .request(apiPath)
          .post("/refresh")
          .type("form")
          .set("Authorization", token)
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.be.an("object").and.deep.equal({
              name: "Error",
              message: "This token cannot be used for this request."
            });
            done();
          });
      });

      it("it should not refresh the token if token has already been blacklisted", (done) => {
        chai
          .request(apiPath)
          .post("/refresh")
          .type("form")
          .set("Authorization", refresh_token)
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.be.an("object").and.deep.equal({
              name: "Error",
              message: "This Token is blacklisted"
              // "message": "This token cannot be used for this request."
            });
            done();
          });
      });

      it("it should not refresh the token if token is not correct", (done) => {
        chai
          .request(apiPath)
          .post("/refresh")
          .type("form")
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

      it("it should not refresh the token if token is not provided", (done) => {
        chai
          .request(apiPath)
          .post("/refresh")
          .type("form")
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.be.an("string").and.equal("No Token Present");
            done();
          });
      });
    });
  });
}