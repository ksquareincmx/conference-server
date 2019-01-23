// During the test the env variable is set to test
process.env.NODE_ENV = "test";
require("dotenv").config();

import { config } from "../app/config/config";
import {
  Credentials,
  db,
  JWTBlacklist,
  Profile,
  User,
  UserData
} from "./common";

import * as jwt from "jsonwebtoken";
import * as _ from "lodash";
import * as moment from "moment";
import * as uuid from "uuid";

// Import tests...
import { authTest } from "./v1/Auth";
import { profileTest } from "./v1/Profile";
import { roomTest } from "./v1/Room";
import { userTest } from "./v1/User";

const login = async user => {
  try {
    const dbuser = await User.findOne({
      where: { email: user.email, authProviderId: null },
      include: [{ model: Profile, as: "profile" }]
    });
    const authenticate = await dbuser.authenticate(user.password);
    if (authenticate) {
      const credentials: any = await getCredentials(dbuser);
      return credentials;
    } else {
      return null;
    }
  } catch (err) {
    throw err;
  }
};

const logout = async (token, expires) => {
  try {
    const schemelessToken = token.split(" ")[1];
    await JWTBlacklist.create({
      expires,
      token: schemelessToken
    });
    return true;
  } catch (err) {
    throw err;
  }
};

const getCredentials = (user: any): any => {
  // Prepare response object
  const token = createToken(user, "access");
  const refreshToken = createToken(user, "refresh");
  const credentials = {
    token: token.token,
    expires: token.expires,
    refresh_token: refreshToken,
    user: _.pick(user, ["id", "name", "email", "role"]),
    profile: user.profile
  };
  return credentials;
};

const createToken = (user: any, type: string) => {
  const expiryUnit: any = config.jwt[type].expiry.unit;
  const expiryLength = config.jwt[type].expiry.length;
  const expires = moment()
    .add(expiryLength, expiryUnit)
    .valueOf();
  const issued = Date.now();
  const expiresIn = (expires - issued) / 1000; // seconds

  const token = jwt.sign(
    {
      id: user.id,
      sub: config.jwt[type].subject,
      aud: config.jwt[type].audience,
      exp: expires,
      iat: issued,
      jti: uuid.v4(),
      email: user.email,
      role: user.role
    },
    config.jwt.secret
  );

  return {
    token,
    expires,
    expiresIn
  };
};

describe("Main", function() {
  const userData: UserData = {
    userId: "",
    profileId: ""
  };

  const authCredentials: Credentials = {
    token: "",
    blackListedToken: "",
    refreshToken: ""
  };

  const testUser = {
    email: "testuser@test.com",
    password: "12345678"
  };

  before(async function() {
    // Open db connection if it is not currently open.
    const isConnectionOpen = !!db.authenticate();
    if (!isConnectionOpen) {
      await db.sync();
    }

    // Before testing it is convenient to create a new user..
    const createdUser: any = await User.create({ ...testUser, role: "admin" });
    const user: any = await User.findOne({
      where: { id: createdUser.id },
      include: [{ model: Profile, as: "profile" }]
    });
    userData.userId = createdUser.id.toString();
    userData.profileId = user.profile.id.toString();

    // Log in
    const expiredCredentials = await login(testUser);
    authCredentials.blackListedToken = `Bearer ${expiredCredentials.token}`;

    // Log out to blacklist the token.
    const somt = await logout(
      authCredentials.blackListedToken,
      expiredCredentials.expires
    );

    const credentials = await login(testUser);
    authCredentials.token = `Bearer ${credentials.token}`;
    authCredentials.refreshToken = `Bearer ${credentials.refresh_token.token}`;
  });

  after(async function() {
    // Delete user after all tests.
    const user: any = await User.findOne({
      where: { id: userData.userId }
    });
    if (user) {
      await User.destroy({ where: { id: userData.userId } });
    }
    await db.close();
  });

  authTest(authCredentials, testUser);
  roomTest(authCredentials);
  profileTest(authCredentials, userData);
  userTest(authCredentials, userData);
});
