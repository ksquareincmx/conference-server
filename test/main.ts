// During the test the env variable is set to test
process.env.NODE_ENV = "test";
require("dotenv").config();

import { chai, db, Credentials, Profile, User, UserData } from "./common";

// Import tests...
import { authTest } from "./v1/Auth";
import { profileTest } from "./v1/Profile";
import { roomTest } from "./v1/Room";
import { userTest } from "./v1/User";

describe("Main", function()  {

  const userData: UserData = {
    userId: "",
    profileId : ""
  };

  const  authCredentials: Credentials = {
    token: "",
    blackListedToken: ""
  };

  before(async function() {
    console.log('before');
    // Before testing it is convenient to create a new user..
    const testUser = {
      email: "testuser541@test.com",
      password: "12345678"
    };
    const isConnectionOpen = !!db.authenticate();
    if (!isConnectionOpen) { await db.sync(); }

    const createdUser: any = await User.create({...testUser, role: "admin"});
    const user: any = await User.findOne({
      where: { id: createdUser.id },
      include: [{ model: Profile, as: "profile" }]
    });
    userData.userId = createdUser.id.toString();
    userData.profileId = user.profile.id.toString();

    // Log in once as administrator
    // Could be any request library...

    const expiredCredentials = await chai.request("http://localhost:8888/api/v1/auth/")
      .post("/login")
      .type("form")
      .send(testUser);
    authCredentials.blackListedToken = `Bearer ${expiredCredentials.body.token}`;

    await chai.request("http://localhost:8888/api/v1/auth/")
      .post("/logout")
      .type("form")
      .set("Authorization", authCredentials.blackListedToken);

    const credentials = await chai.request("http://localhost:8888/api/v1/auth/")
      .post("/login")
      .type("form")
      .send(testUser);
    authCredentials.token =  `Bearer ${credentials.body.token}`;

    console.log('before complete');
  });

  after(async function() {
    console.log('after');
    // Delete user if it still exists after the delete test.
    const user: any = await User.findOne({
      where: { id: userData.userId }
      // include: [{ model: Profile, as: "profile" }]
    });
    if (user) {
      await User.destroy({where: { id: userData.userId }});
    }
    await db.close();
  });

  roomTest(authCredentials);
  profileTest(authCredentials, userData);
  userTest(authCredentials, userData);

});