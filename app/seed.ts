require("dotenv").config();
import { setupDB } from "./db";
import { log } from "./libraries/Log";
import { User } from "./models/User";
import { Room } from "./models/Room";

setupDB()
  .then(() => {
    return seed();
  })
  .then(() => {
    log.info("SEED DONE");
    process.exit();
  })
  .catch(err => {
    log.error("ERROR EXECUTING SEED:", err);
    process.exit();
  });

function seed(): PromiseLike<any> {
  // Do your seed code here, should return a promise that resolves whenn you are done.

  // Creates first admin user
  return User.count().then((count: number) => {
    if (count === 0)
      return Promise.all([
        User.create({
          name: "Admin",
          email: "admin@example.com",
          password: "adminadmin",
          role: "admin"
        }),

        // Room seeding
        Room.create({
          name: "Dewitt",
          color: "#e1f7d5"
        }),
        Room.create({
          name: "Dumbledore",
          color: "#ffbdbd"
        }),
        Room.create({
          name: "Wayne",
          color: "#c9c9ff"
        }),
        Room.create({
          name: "Stark",
          color: "#f1cbff"
        }),
        Room.create({
          name: "Ganondorf",
          color: "#305F72"
        }),
        Room.create({
          name: "Skywalker",
          color: "#f09c67"
        })
      ]);
    return null;
  });
}
