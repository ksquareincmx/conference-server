require("dotenv").config();

import { log } from "./libraries/Log";
import { setupDB } from "./db";
import { setupServer } from "./server";
import JanitorService from "./services/JanitorService";
import EventService from "./services/EventService";

import { io, setupSockets } from "./sockets";

process.env.TZ = "UTC"; // IMPORTANT For correct timezone management with DB, Tasks etc.

setupDB()
  .then(() => {
    JanitorService.init();
    EventService.init();
    
    setupSockets();
    
    setupServer();
  })
  .catch(err => {
    log.error(err);
  });
