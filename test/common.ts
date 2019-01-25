// Import DB setup and models
import { db } from "../app/db";
import { IUserId, IUserLogin } from "../app/interfaces/UserInterfaces";
import { Booking } from "../app/models/Booking";
import { JWTBlacklist } from "../app/models/JWTBlacklist";
import { Profile } from "../app/models/Profile";
import { Room } from "../app/models/Room";
import { User } from "../app/models/User";

// Import the dev-dependencies
import * as chai from "chai";
import chaiHttp = require("chai-http");
let should = chai.should();
chai.use(chaiHttp);

interface ICredential {
  token: string;
  blackListedToken: string;
  refreshToken: string;
}

export {
  Booking,
  chai,
  ICredential,
  IUserId,
  IUserLogin,
  db,
  JWTBlacklist,
  should,
  User,
  Profile,
  Room
};
