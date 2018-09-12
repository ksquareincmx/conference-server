
import { Controller } from "./../../libraries/Controller";
import { Booking } from "./../../models/Booking";
import { Request, Response, Router } from "express";
import { validateJWT, filterOwner, appendUser, stripNestedObjects, filterRoles } from "./../../policies/General";

export class BookingController extends Controller {

  constructor() {
    super();
    this.name = "booking";
    this.model = Booking;
  }

  routes(): Router {

    this.router.get("/", validateJWT("access"), filterOwner(), (req, res) => this.find(req, res));
    this.router.get("/:id", validateJWT("access"), filterOwner(), (req, res) => this.findOne(req, res));
    this.router.post("/", validateJWT("access"), stripNestedObjects(), filterOwner(), appendUser(), (req, res) => this.create(req, res));
    this.router.put("/:id", validateJWT("access"), stripNestedObjects(), filterOwner(), appendUser(), (req, res) => this.update(req, res));
    this.router.delete("/:id", validateJWT("access"), filterOwner(), (req, res) => this.destroy(req, res));

    return this.router;
  }

}

const booking = new BookingController();
export default booking;