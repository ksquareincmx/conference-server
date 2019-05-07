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

async function seed(): Promise<any> {
  // Do your seed code here, should return a promise that resolves whenn you are done.
  // Creates first admin user
  return Promise.all([
    adminUser(),
    room1(),
    room2(),
    room3(),
    room4(),
    room5(),
    room6()
  ]);
}

async function findRoom(name: string) {
  return Room.find({
    where: {
      name
    }
  });
}

const adminUser = async function() {
  const user = await User.count();
  if (user === 0)
    return User.create({
      name: "Admin",
      email: "admin@example.com",
      password: "adminadmin",
      role: "admin"
    });
  return null;
};

const room1 = async function() {
  const room = await findRoom("DeWitt");
  if (!room) {
    return Room.create({
      name: "DeWitt",
      bgColor: "#e5878d",
      txtColor: "#7d1d23",
      presence: 0
    });
  }
  return null;
};
const room2 = async function() {
  const room = await findRoom("Skywalker");
  if (!room) {
    return Room.create({
      name: "Skywalker",
      bgColor: "#7bd1bd",
      txtColor: "#00543f",
      presence: 0
    });
  }
  return null;
};
const room3 = async function() {
  const room = await findRoom("Ganondorf");
  if (!room) {
    return Room.create({
      name: "Ganondorf",
      bgColor: "#a982bf",
      txtColor: "#400063",
      presence: 0
    });
  }
  return null;
};
const room4 = async function() {
  const room = await findRoom("Stark");
  if (!room) {
    return Room.create({
      name: "Stark",
      bgColor: "#a3a3a3",
      txtColor: "#3f3f3f",
      presence: 0
    });
  }
  return null;
};
const room5 = async function() {
  const room = await findRoom("Dumbledore");
  if (!room) {
    return Room.create({
      name: "Dumbledore",
      bgColor: "#ff0000",
      txtColor: "#f2d72b",
      presence: 0
    });
  }
  return null;
};

const room6 = async function() {
  const room = await findRoom("Wayne");
  if (!room) {
    return Room.create({
      name: "Wayne",
      bgColor: "#555472",
      txtColor: "#0f0e38",
      presence: 0
    });
  }
  return null;
};
