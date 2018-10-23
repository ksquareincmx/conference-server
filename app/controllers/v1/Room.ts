import { Op } from "sequelize";
import { Controller } from "./../../libraries/Controller";
import { getActualDate } from "./../../libraries/util";
import { Room } from "./../../models/Room";
import { Booking } from "./../../models/Booking";
import { Request, Response, Router } from "express";
import {
  validateJWT,
  filterOwner,
  appendUser,
  stripNestedObjects,
  filterRoles
} from "./../../policies/General";

export class RoomController extends Controller {
  constructor() {
    super();
    this.name = "room";
    this.model = Room;
  }

  routes(): Router {
    /**
        @api {get} /api/v1/Room/ Get a list of Rooms
          @apiName getAllRooms
        @apiPermission access
        @apiGroup Room

        @apiHeader { String }   Content-Type Application/Json
        @apiHeader { String }   Authorization Bearer [jwt token]

        @apiSuccess  {Object[]}   body                    Room details
        @apiSuccess  {String}     body.name               Room name
        @apiSuccess  {String}     body.color              The color to show in the UI for this room
        @apiSuccess  {Boolean}    body.presence           If there is someone in the room (For future sensor integration)
        @apiSuccess  {Number}     body.bookingId          Booking id if not available, null if available
        @apiSuccess  {Date}        body.updatedAt         Room creation date
        @apiSuccess  {Date}        body.createdAt         Room update date


    */

    this.router.get("/", validateJWT("access"), (req, res) =>
      this.findAllRoom(req, res)
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
        @apiSuccess  {Number}   body.bookingId      Booking id if not available, null if available
        @apiSuccess  {Date}     body.updatedAt      Room creation date
        @apiSuccess  {Date}     body.createdAt      Room update date

    */

    this.router.get("/:id", validateJWT("access"), (req, res) =>
      this.findOneRoom(req, res)
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
        @apiSuccess  {Number}   body.id             Room id
        @apiSuccess  {String}   body.name           Room name
        @apiSuccess  {String}   body.color          The color to show in the UI for this room
        @apiSuccess  {Boolean}  body.presence       If there is someone in the room
        @apiSuccess  {Date}     body.updatedAt      Room creation date
        @apiSuccess  {Date}     body.createdAt      Room update date

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
        @apiSuccess  {Date}     body.updatedAt      Room creation date
        @apiSuccess  {Date}     body.createdAt      Room update date

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

  findOneRoom(req: Request, res: Response) {
    let roomId = req.params.id;
    let actualDate = getActualDate();

    this.model
      .findById(roomId)
      .then(async roomResult => {
        if (!roomResult) res.status(404).end();
        else {
          let room = JSON.parse(JSON.stringify(roomResult, null, 2));

          let bookingResult = await Booking.findOne({
            attributes: ["id"],
            where: {
              [Op.and]: {
                roomId: {
                  [Op.eq]: roomId
                },
                start: {
                  [Op.lte]: actualDate
                },
                end: {
                  [Op.gte]: actualDate
                }
              }
            }
          });
          let parsedBooking = JSON.parse(
            JSON.stringify(bookingResult, null, 2)
          );
          if (parsedBooking) {
            room["bookingId"] = bookingResult.id;
          } else {
            room["bookingId"] = null;
          }

          res.status(200).json(room);
        }
        return null;
      })
      .catch(err => {
        if (err) Controller.serverError(res, err);
      });
  }

  findAllRoom(req: Request, res: Response) {
    let actualDate = getActualDate();

    this.model
      .findAll()
      .then(async resultRooms => {
        let parsedRooms = JSON.parse(JSON.stringify(resultRooms, null, 2));

        let rooms = parsedRooms.map(async room => {
          let bookingResult = await Booking.findOne({
            attributes: ["id"],
            where: {
              [Op.and]: {
                roomId: {
                  [Op.eq]: room.id
                },
                start: {
                  [Op.lte]: actualDate
                },
                end: {
                  [Op.gte]: actualDate
                }
              }
            }
          });
          let parsedBookings = JSON.parse(
            JSON.stringify(bookingResult, null, 2)
          );
          if (parsedBookings) {
            room["bookingId"] = bookingResult.id;
          } else {
            room["bookingId"] = null;
          }
          return room;
        });
        rooms = await Promise.all(rooms);
        res.status(200).json(rooms);
      })
      .catch(err => {
        return Controller.serverError(err);
      });
  }
}

const room = new RoomController();
export default room;
