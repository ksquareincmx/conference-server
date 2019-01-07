import { Op } from "sequelize";
import { Controller } from "./../../libraries/Controller";
import { getActualDate } from "./../../libraries/util";
import { Room } from "./../../models/Room";
import { Booking } from "./../../models/Booking";
import { Request, Response, Router } from "express";
import { isEmpty } from "./../../libraries/util";
import {
  validateJWT,
  filterOwner,
  appendUser,
  stripNestedObjects,
  filterRoles
} from "./../../policies/General";
import {
  IRoomResponse,
  IFindRoomParams,
  IUpdateRoomRequest,
  ICreateRoomRequest
} from "./../../interfaces/RoomInterfaces";
import { roomMapper } from "./../../mappers/RoomMapper";

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
        @apiSuccess  {Number}     body.id                 Room id
        @apiSuccess  {String}     body.name               Room name
        @apiSuccess  {String}     body.color              The color to show in the UI for this room
        @apiSuccess  {Boolean}    body.presence           If there is someone in the room (For future sensor integration)
        @apiSuccess  {Number}     body.bookingIdActual    Booking id that currently occupies the room, null if its not
        @apiSuccess  {String}     body.status             Room avability ("Not Available", "Available")
        @apiSuccess  {Date}       body.updatedAt          Room creation date
        @apiSuccess  {Date}       body.createdAt          Room update date


    */

    this.router.get("/", validateJWT("access"), this.findAllRoom);

    /**
        @api {get} /api/v1/Room/:id Get a Room
        @apiPermission access
        @apiName getRoom
        @apiGroup Room

        @apiHeader { String }   Content-Type Application/Json
        @apiHeader { String }   Authorization Bearer [jwt token]

        @apiSuccess  {Object}   body                      Room details
        @apiSuccess  {Number}   body.id                   Room id
        @apiSuccess  {String}   body.name                 Room name
        @apiSuccess  {String}   body.color                The color to show in the UI for this room
        @apiSuccess  {Boolean}  body.presence             If there is someone in the room
        @apiSuccess  {Number}   body.bookingIdActual      Booking id that currently occupies the room, null if its not
        @apiSuccess  {String}   body.status               Room avability ("Not Available", "Available")
        @apiSuccess  {Date}     body.updatedAt            Room creation date
        @apiSuccess  {Date}     body.createdAt            Room update date
    */

    this.router.get("/:id", validateJWT("access"), this.findOneRoom);

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
      this.createRoom
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
        @apiSuccess  {Number}   body.id             Room id
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
      this.updateRoom
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

  /**
   * @typedef {Object} RoomStatus
   * @property {number} bookingIdActual - Booking id that currently occupies the room, null if its not.
   * @property {string} roomAvability - Room avability ("Not Available", "Available")
   */

  /**
   * Return the room status
   * @param {number} roomId - Room id
   * @return {RoomStatus}   - Room status
   */
  public roomStatus = async (roomId: number, actualDate = getActualDate()) => {
    try {
      const bookingId = await Booking.findOne({
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

      const parsedBookingId = JSON.parse(JSON.stringify(bookingId));
      const bookingIdActual = parsedBookingId ? parsedBookingId["id"] : null;
      const status = bookingIdActual ? "Not Available" : "Available";

      return { bookingIdActual, status };
    } catch (err) {
      throw err;
    }
  };

  /**
   * @typedef {Room}
   * @property {string} name - Room name
   * @property {string} color - The color to show in the UI for this room
   * @property {boolean} presence - If there is someone in the room (For future sensor integration)
   * @property {number} bookingIdActual - Booking id that currently occupies the room, null if its not
   * @property {string} status - Room avability ("Not Available", "Available")
   * @property {string} updatedAt - Room creation date
   * @property {string} createdAt - Room update date
   */

  /**
   * Returns a Room object that match with the id
   * @param {number} id - id of the room to recover
   * @return {Room} Requested Room
   */

  findOneRoom = async (req: Request, res: Response) => {
    const data: IFindRoomParams = { params: req.params };
    try {
      const room = await this.model.findById(data.params.id);

      if (!room) {
        return Controller.notFound(res);
      }

      const parsedRoom = JSON.parse(JSON.stringify(room));
      const roomStatus = await this.roomStatus(parsedRoom["id"]);
      const roomBooking = { ...parsedRoom, ...roomStatus };
      const DTORoom = roomMapper.toDTO(roomBooking);
      res.status(200).json(DTORoom);
    } catch (err) {
      return Controller.serverError(res, err);
    }
  };

  /**
   * Returns all Rooms
   * @return {Array<Room>} Rooms
   */
  findAllRoom = async (req: Request, res: Response) => {
    try {
      const rooms = await this.model.findAll();
      const parsedRooms = JSON.parse(JSON.stringify(rooms, null, 2));

      const roomsBooking = parsedRooms.map(async room => {
        const roomStatus = await this.roomStatus(room["id"]);
        return { ...room, ...roomStatus };
      });

      const resolvedRooms = await Promise.all(roomsBooking);
      const DTORooms = resolvedRooms.map(roomMapper.toDTO);
      res.status(200).json(DTORooms);
    } catch (err) {
      return Controller.serverError(res, err);
    }
  };

  createRoom = async (req: Request, res: Response) => {
    const data: ICreateRoomRequest = <ICreateRoomRequest>{
      body: roomMapper.toEntity(req.body)
    };

    if (isEmpty(data.body.name)) {
      return Controller.badRequest(res, "Bad Request: No name in request");
    }
    if (isEmpty(data.body.color)) {
      return Controller.badRequest(res, "Bad Request: No color in request");
    }

    try {
      const room = await this.model.findOne({
        where: {
          [Op.or]: { name: data.body.name, color: data.body.color }
        }
      });

      if (room) {
        return Controller.badRequest(
          res,
          "Bad Request: name and color must be uniques"
        );
      }

      const roomCreated = await this.model.create(data.body);
      const parsedRoom = JSON.parse(JSON.stringify(roomCreated));
      const DTORoom = roomMapper.toDTO(parsedRoom);
      return res.status(200).json(DTORoom);
    } catch (err) {
      return Controller.serverError(res);
    }
  };

  updateRoom = async (req: Request, res: Response) => {
    const data: IUpdateRoomRequest = <IUpdateRoomRequest>{
      params: req.params,
      body: roomMapper.toEntity(req.body)
    };

    if (isEmpty(data.body.name)) {
      return Controller.badRequest(res, "Bad Request: No name in request");
    }
    if (isEmpty(data.body.color)) {
      return Controller.badRequest(res, "Bad Request: No color in request");
    }

    try {
      const room = await this.model.findOne({
        where: {
          [Op.or]: { name: data.body.name, color: data.body.color },
          id: { [Op.ne]: data.params.id }
        }
      });

      if (room) {
        return Controller.badRequest(
          res,
          "Bad Request: name and color must be uniques"
        );
      }

      const actualBooking = await this.model.findById(data.params.id);
      const roomUpdated = await actualBooking.update({
        ...data.body,
        ...data.params
      });
      const parsedRoom = JSON.parse(JSON.stringify(roomUpdated));
      const DTORoom = roomMapper.toDTO(parsedRoom);

      return res.status(200).json(DTORoom);
    } catch (err) {
      return Controller.serverError(res, err);
    }
  };
}

const room = new RoomController();
export default room;
