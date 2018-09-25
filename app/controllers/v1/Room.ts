
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

    /**
        @api {get} /api/v1/Room/ Get a list of Rooms
        @apiPermission access
        @apiName getAllRooms
        @apiGroup Room

        @apiHeader { String }   Content-Type Application/Json
        @apiHeader { String }   Authorization Bearer [jwt token]

        @apiSuccess  {Object[]}   body                    Room details
        @apiSuccess  {String}     body.name               Room name
        @apiSuccess  {String}     body.color              The color to show in the UI for this room
        @apiSuccess  {Boolean}     body.presence          If there is someone in the room
    */

    this.router.get(
      "/",
      validateJWT("access"),
      (req, res) => this.find(req, res)
    );

    /**
        @api {get} /api/v1/Room/:id Get a Room
        @apiPermission access
        @apiName getRoom
        @apiGroup Room

        @apiHeader { String }   Content-Type Application/Json
        @apiHeader { String }   Authorization Bearer [jwt token]

        @apiSuccess  {Object}   body                Room details
        @apiSuccess  {String}   body.name           Room name
        @apiSuccess  {String}   body.color          The color to show in the UI for this room
        @apiSuccess  {Boolean}  body.presence       If there is someone in the room
    */

    this.router.get(
      "/:id",
      validateJWT("access"),
      (req, res) => this.findOne(req, res)
    );

    /**
        @api {post} /api/v1/Room/ Create a Room
        @apiPermission access (only admin)
        @apiName postRoom
        @apiGroup Room

        @apiHeader { String }   Content-Type Application/Json
        @apiHeader { String }   Authorization Bearer [jwt token]

        @apiParam    {Object}   body                Room details
        @apiParam    {String}   body.name           Room name
        @apiParam    {String}   body.color          The color to show in the UI for this room
        @apiParam    {Boolean}  body.presence       If there is someone in the room

        @apiSuccess  {Object}   body                Room details
        @apiSuccess  {String}   body.name           Room name
        @apiSuccess  {String}   body.color          The color to show in the UI for this room
        @apiSuccess  {Boolean}  body.presence       If there is someone in the room
    */

    this.router.post(
      "/",
      validateJWT("access"),
      stripNestedObjects(),
      filterRoles(["admin"]),
        (req, res) => this.create(req, res)
    );

    /**
        @api {put} /api/v1/Room/:id Modify a room
        @apiPermission access (only admin)
        @apiName putRoom
        @apiGroup Room

        @apiHeader { String }   Content-Type Application/Json
        @apiHeader { String }   Authorization Bearer [jwt token]

        @apiParam    {Object}   body                Room details
        @apiParam    {String}   body.name           Room name
        @apiParam    {String}   body.color          The color to show in the UI for this room
        @apiParam    {Boolean}  body.presence       If there is someone in the room

        @apiSuccess  {Object}   body                Room details
        @apiSuccess  {String}   body.name           Room name
        @apiSuccess  {String}   body.color          The color to show in the UI for this room
        @apiSuccess  {Boolean}  body.presence       If there is someone in the room
    */

    this.router.put(
      "/:id",
      validateJWT("access"),
      stripNestedObjects(),
      filterRoles(["admin"]),
      (req, res) => this.update(req, res)
    );

    /**
        @api {delete} /api/v1/Room/:id Delete a Room
        @apiPermission access (only admin)
        @apiName deleteRoom
        @apiGroup Room

        @apiHeader { String }   Content-Type Application/Json
        @apiHeader { String }   Authorization Bearer [jwt token]

    */

    this.router.delete(
      "/:id",
      validateJWT("access"),
      filterRoles(["admin"]),
      (req, res) => this.destroy(req, res)
    );

    return this.router;
  }

}

const room = new RoomController();
export default room;
