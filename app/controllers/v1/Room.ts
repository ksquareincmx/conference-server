
import { Controller } from "./../../libraries/Controller";
import { Room } from "./../../models/Room";
import { Request, Response, Router } from "express";
import { validateJWT, filterOwner, appendUser, stripNestedObjects, filterRoles } from "./../../policies/General";

export class RoomController extends Controller {

  constructor() {
    super();
    this.name = "room";
    this.model = Room;
  }

  routes(): Router {

    this.router.get("/", validateJWT("access"), (req, res) => this.find(req, res));
    this.router.get("/:id", validateJWT("access"), (req, res) => this.findOne(req, res));
    this.router.post("/", validateJWT("access"), stripNestedObjects(), (req, res) => this.create(req, res));
    this.router.put("/:id", validateJWT("access"), stripNestedObjects(), (req, res) => this.update(req, res));
    this.router.delete("/:id", validateJWT("access"), (req, res) => this.destroy(req, res));

    return this.router;
  }

}

const room = new RoomController();
export default room;