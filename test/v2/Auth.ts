import { chai, ICredential, IUserLogin, User } from "../common";

const apiPath = "http://localhost:8888/api/v2/auth/";

export const authTest = (auth: ICredential, testUser: IUserLogin) => {
  describe("Auth", () => {
    /*
     * Test the /register route
     */
    describe("/register", () => {
      const registerUser: IUserLogin = {
        email: "register@test.com",
        password: "12345678"
      };

      after(async function() {
        try {
          const user: any = await User.findOne({
            where: { email: registerUser.email }
          });
          if (user) {
            await User.destroy({ where: { id: user.id } });
          }
        } catch (err) {
          throw err;
        }
      });

      it("it should register a new user user", done => {
        chai
          .request(apiPath)
          .post("/register")
          .send(registerUser)
          .end((err, res) => {
            if (err) {
              throw err;
            }
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

      it("it should not register an email which is already in use", done => {
        chai
          .request(apiPath)
          .post("/register")
          .send(testUser)
          .end((err, res) => {
            if (err) {
              throw err;
            }
            res.should.have.status(403);
            res.body.should.be.a("string").and.equal("email in use");
            done();
          });
      });

      it("it should not register a User if password length is less than 8", done => {
        chai
          .request(apiPath)
          .post("/register")
          .send({
            ...registerUser,
            password: "1234567"
          })
          .end((err, res) => {
            if (err) {
              throw err;
            }
            res.should.have.status(500);
            done();
          });
      });
    });

    /*
     * Test the /login route
     */
    describe("/login", () => {
      it("it should login the user", done => {
        chai
          .request(apiPath)
          .post("/login")
          .send(testUser)
          .end((err, res) => {
            if (err) {
              throw err;
            }
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

      it.skip("it should not login if email is not registered", done => {
        chai
          .request(apiPath)
          .post("/login")
          .type("form")
          .send({
            email: "somthing@test.com",
            password: "12345678"
          })
          .end((err, res) => {
            res.should.have.status(403);
            res.body.should.be.a("string").and.equal("email not registered");
            done();
          });
      });

      it("it should not login if password is incorrect", done => {
        chai
          .request(apiPath)
          .post("/login")
          .send({
            ...testUser,
            password: "1234567"
          })
          .end((err, res) => {
            if (err) {
              throw err;
            }
            res.should.have.status(401);
            res.body.should.be.a("string").and.equal("Unauthorized");
            done();
          });
      });

      it.skip("it should not login if params are invalid", done => {
        chai
          .request(apiPath)
          .post("/register")
          .type("form")
          .send({
            email: "notRegistered@test.com",
            password: "12345678"
          })
          .end((err, res) => {
            res.should.have.status(403);
            res.body.should.be.a("string").and.equal("email in use");
            done();
          });
      });
    });

    /*
     * Test the /logout route
     */
    describe("/logout", () => {
      after(async function() {
        try {
          // Redo Login
          const credentials = await chai
            .request(apiPath)
            .post("/login")
            .send(testUser);
          auth.refreshToken = `Bearer ${credentials.body.refresh_token.token}`;
          auth.token = `Bearer ${credentials.body.token}`;
        } catch (err) {
          throw err;
        }
      });
      it("it should logout the user", done => {
        chai
          .request(apiPath)
          .post("/logout")
          .set("Authorization", auth.token)
          .end((err, res) => {
            if (err) {
              throw err;
            }
            res.should.have.status(200);
            res.body.should.be.a("string").and.equal("OK");
            done();
          });
      });

      it("it should not logout if token has already been blacklisted", done => {
        chai
          .request(apiPath)
          .post("/logout")
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

      it("it should not logout if token is not correct", done => {
        chai
          .request(apiPath)
          .post("/logout")
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

      it("it should not logout if token is not provided", done => {
        chai
          .request(apiPath)
          .post("/logout")
          .end((err, res) => {
            if (err) {
              throw err;
            }
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
      it("it should change the password", done => {
        chai
          .request(apiPath)
          .post("/change")
          .set("Authorization", auth.token)
          .send({
            email: testUser.email,
            oldPass: testUser.password,
            newPass: "87654321"
          })
          .end((err, res) => {
            if (err) {
              throw err;
            }
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

      it("it should not change the password if token is not correct", done => {
        chai
          .request(apiPath)
          .post("/change")
          .set("Authorization", "")
          .send({
            email: testUser.email,
            oldPass: testUser.password,
            newPass: "87654321"
          })
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

      it("it should not change the password if token is not provided", done => {
        chai
          .request(apiPath)
          .post("/change")
          .send({
            email: testUser.email,
            oldPass: testUser.password,
            newPass: "87654321"
          })
          .end((err, res) => {
            if (err) {
              throw err;
            }
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
      it("it should refresh the token", done => {
        chai
          .request(apiPath)
          .post("/refresh")
          .set("Authorization", auth.refreshToken)
          .end((err, res) => {
            if (err) {
              throw err;
            }
            res.should.have.status(200);
            res.body.should.be.an("object");
            res.body.should.have.property("token");
            res.body.should.have.property("expires");
            res.body.should.have.property("refresh_token");
            res.body.should.have.property("user");
            done();
          });
      });

      it("it should not refresh the token if token is not refresh_token", done => {
        chai
          .request(apiPath)
          .post("/refresh")
          .set("Authorization", auth.token)
          .end((err, res) => {
            if (err) {
              throw err;
            }
            res.should.have.status(401);
            res.body.should.be.an("object").and.deep.equal({
              name: "Error",
              message: "This token cannot be used for this request."
            });
            done();
          });
      });

      it("it should not refresh the token if token has already been blacklisted", done => {
        chai
          .request(apiPath)
          .post("/refresh")
          .set("Authorization", auth.refreshToken)
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

      it("it should not refresh the token if token is not correct", done => {
        chai
          .request(apiPath)
          .post("/refresh")
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

      it("it should not refresh the token if token is not provided", done => {
        chai
          .request(apiPath)
          .post("/refresh")
          .end((err, res) => {
            if (err) {
              throw err;
            }
            res.should.have.status(401);
            res.body.should.be.an("string").and.equal("No Token Present");
            done();
          });
      });
    });
  });
};
