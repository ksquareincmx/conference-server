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
  const room1 = Room.find({
    where: {
      name: "DeWitt"
    }
  }).then(room => {
    if (!room) {
      return Room.create({
        name: "DeWitt",
        bgColor: "#e5878d",
        txtColor: "#7d1d23",
        presence: 0
      });
    }
    return null;
  });
  const room2 = Room.find({
    where: {
      name: "Skywalker"
    }
  }).then(room => {
    if (!room) {
      return Room.create({
        name: "Skywalker",
        bgColor: "#7bd1bd",
        txtColor: "#00543f",
        presence: 0
      });
    }
    return null;
  });
  const room3 = Room.find({
    where: {
      name: "Ganondorf"
    }
  }).then(room => {
    if (!room) {
      return Room.create({
        name: "Ganondorf",
        bgColor: "#a982bf",
        txtColor: "#400063",
        presence: 0
      });
    }
    return null;
  });
  const room4 = Room.find({
    where: {
      name: "Stark"
    }
  }).then(room => {
    if (!room) {
      return Room.create({
        name: "Stark",
        bgColor: "#a3a3a3",
        txtColor: "#3f3f3f",
        presence: 0
      });
    }
    return null;
  });
  const room5 = Room.find({
    where: {
      name: "Dumbledore"
    }
  }).then(room => {
    if (!room) {
      return Room.create({
        name: "Dumbledore",
        bgColor: "#ff0000",
        txtColor: "#f2d72b",
        presence: 0
      });
    }
    return null;
  });
  const room6 = Room.find({
    where: {
      name: "Wayne"
    }
  }).then(room => {
    if (!room) {
      return Room.create({
        name: "Wayne",
        bgColor: "#555472",
        txtColor: "#0f0e38",
        presence: 0
      });
    }
    return null;
  });
  // Creates first admin user
  const user = User.count().then((count: number) => {
    if (count === 0)
      return User.create({
        name: "Admin",
        email: "admin@example.com",
        password: "adminadmin",
        role: "admin"
      });
    return null;
  });

  return Promise.all([user, room1, room2, room3, room4, room5, room6]);
}
