// Import DB setup and models
import { db } from "../app/db";
import { JWTBlacklist } from "../app/models/JWTBlacklist";
import { Profile } from "../app/models/Profile";
import { Room } from "../app/models/Room";
import { User } from "../app/models/User";

// Import the dev-dependencies
import * as chai from "chai";
import chaiHttp = require("chai-http");
let should = chai.should();
chai.use(chaiHttp);

interface UserData {
  profileId: string;
  userId: string;
}

interface Credentials {
  token: string;
  blackListedToken: string;
  refreshToken: string;
}

export {
  chai,
  Credentials,
  db,
  JWTBlacklist,
  should,
  User,
  UserData,
  Room,
  Profile
};
