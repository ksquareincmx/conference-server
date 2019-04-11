import { validate } from "./../../policies/Validate";
import { roomDataStorage } from "./../../dataStorage/SQLDatastorage/Room";
import { Op } from "sequelize";
import * as moment from "moment-timezone";
import * as _ from "lodash";
import { Controller } from "./../../libraries/Controller";
import { getActualDate } from "./../../libraries/util";
import { Room } from "./../../models/Room";
import { Booking } from "./../../models/Booking";
import { Request, Response, Router } from "express";
import { isEmpty } from "./../../libraries/util";
import {
  validateJWT,
  stripNestedObjects,
  filterRoles
} from "./../../policies/General";
import {
  IFindRoomParams,
  IUpdateRoomRequest,
  ICreateRoomRequest
} from "../../interfaces/v2/RoomInterfaces";
import { roomMapper } from "../../mappers/v2/RoomMapper";
import { IGetHourParams, IHour } from "../../interfaces/v2/HourInterfaces";
import { roomSchema } from "./../../policies/DataSchemas/Room";

export class RoomController extends Controller {
  constructor() {
    super();
    this.name = "room";
    this.model = Room;
  }

  routes(): Router {
    /**
        @api {get} /api/v2/room Get Rooms
        @apiVersion 1.0.0
        @apiName getRooms
        @apiPermission access
        @apiGroup Room

        @apiHeader  {string}   Content-Type Application/Json
        @apiHeader  {string}   Authorization Bearer [jwt token]

        @apiSuccess  {Object[]}   body                      Room details
        @apiSuccess  {number}     body.id                   Room id
        @apiSuccess  {string}     body.name                 Room name
        @apiSuccess  {string}     body.color                The color to show in the UI for this room
        @apiSuccess  {Boolean}    body.presence             If there is someone in the room (For future sensor integration)
        @apiSuccess  {number}     body.booking_id_actual    Booking id that currently occupies the room, null if its not
        @apiSuccess  {string}     body.status               Room avability ("Not Available", "Available")
        @apiSuccess  {Date}       body.updated_at           Room creation date
        @apiSuccess  {Date}       body.created_at           Room update date
    */

    this.router.get("/", validateJWT("access"), this.findAllRoom);

    /**
        @api {get} /api/v2/room/:id Get a Room
        @apiVersion 1.0.0
        @apiPermission access
        @apiName getRoom
        @apiGroup Room

        @apiHeader { string }   Content-Type Application/Json
        @apiHeader { string }   Authorization Bearer [jwt token]

        @apiSuccess  {Object}   body                      Room details
        @apiSuccess  {number}   body.id                   Room id
        @apiSuccess  {string}   body.name                 Room name
        @apiSuccess  {string}   body.color                The color to show in the UI for this room
        @apiSuccess  {Boolean}  body.presence             If there is someone in the room (For future sensor integration)
        @apiSuccess  {number}   body.booking_id_actual      Booking id that currently occupies the room, null if its not
        @apiSuccess  {string}   body.status               Room avability ("Not Available", "Available")
        @apiSuccess  {Date}     body.updated_at            Room creation date
        @apiSuccess  {Date}     body.created_at            Room update date
    */

    this.router.get("/:id", validateJWT("access"), this.findOneRoom);

    /**
        @api {post} /api/v2/room Create a Room
        @apiVersion 1.0.0
        @apiPermission access (only admin)
        @apiName postRoom
        @apiGroup Room

        @apiHeader { string }   Content-Type Application/Json
        @apiHeader { string }   Authorization Bearer [jwt token]

        @apiParam    {Object}   body                Room details
        @apiParam    {string}   body.name           Room name
        @apiParam    {string}   body.color          The color to show in the UI for this room

        @apiSuccess  {Object}   body                Room details
        @apiSuccess  {number}   body.id             Room id
        @apiSuccess  {string}   body.name           Room name
        @apiSuccess  {string}   body.color          The color to show in the UI for this room
        @apiSuccess  {Boolean}  body.presence       If there is someone in the room (For future sensor integration)
        @apiSuccess  {number}   body.booking_id_actual      Booking id that currently occupies the room, null if its not
        @apiSuccess  {string}   body.status               Room avability ("Not Available", "Available")
        @apiSuccess  {Date}     body.updated_at      Room creation date
        @apiSuccess  {Date}     body.created_at      Room update date

    */

    this.router.post(
      "/",
      validateJWT("access"),
      stripNestedObjects(),
      filterRoles(["admin"]),
      validate(roomSchema.createRoom),
      this.createRoom
    );

    /**
        @api {put} /api/v2/room/:id Modify a room
        @apiVersion 1.0.0
        @apiPermission access (only admin)
        @apiName putRoom
        @apiGroup Room

        @apiHeader   {string}   Content-Type Application/Json
        @apiHeader   {string}   Authorization Bearer [jwt token]

        @apiParam    {Object}   body                Room details
        @apiParam    {string}   body.name           Room name
        @apiParam    {string}   body.color          The color to show in the UI for this room

        @apiSuccess  {Object}   body                Room details
        @apiSuccess  {number}   body.id             Room id
        @apiSuccess  {string}   body.name           Room name
        @apiSuccess  {string}   body.color          The color to show in the UI for this room
        @apiSuccess  {Boolean}  body.presence       If there is someone in the room (For future sensor integration)
        @apiSuccess  {number}   body.booking_id_actual      Booking id that currently occupies the room, null if its not
        @apiSuccess  {string}   body.status          Room avability ("Not Available", "Available")
        @apiSuccess  {Date}     body.updated_at      Room creation date
        @apiSuccess  {Date}     body.created_at      Room update date

    */

    this.router.put(
      "/:id",
      validateJWT("access"),
      stripNestedObjects(),
      filterRoles(["admin"]),
      validate(roomSchema.updateRoom),
      this.updateRoom
    );

    /**
        @api {delete} /api/v2/room/:id Delete a Room
        @apiVersion 1.0.0
        @apiPermission access (only admin)
        @apiName deleteRoom
        @apiGroup Room

        @apiHeader { string }   Content-Type Application/Json
        @apiHeader { string }   Authorization Bearer [jwt token]

    */

    this.router.delete(
      "/:id",
      validateJWT("access"),
      filterRoles(["admin"]),
      (req, res) => this.destroy(req, res)
    );

    /**
    @api {get} /api/v2/room/:id/hours Gets available hours
    @apiVersion 1.0.0
    @apiPermission access
    @apiName GetHours
    @apiGroup Booking

    @apiHeader {string}     Content-Type Application/Json
    @apiHeader {string}     Authorization Bearer [jwt token]

    @apiParam  {Date}       body.fromDate    Shows hours available from a date. Default value is the actual date

    @apiSuccess {Object[]}  body           Hours details
    @apiSuccess {Date}      body.start     start hour
    @apiSuccess {Date}      body.end       end hour
     */

    this.router.get(
      "/:id/hours",
      validateJWT("access"),
      this.findAvailableHours
    );

    return this.router;
  }

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
      const bookingIdActual = parsedBookingId ? parsedBookingId.id : null;
      const status = bookingIdActual ? "Not Available" : "Available";

      return { bookingIdActual, status };
    } catch (err) {
      throw err;
    }
  };

  findOneRoom = async (req: Request, res: Response) => {
    const data: IFindRoomParams = { params: req.params };
    try {
      const room = await roomDataStorage.findById(data.params.id);

      if (!room) {
        return Controller.notFound(res);
      }

      const roomStatus = await this.roomStatus(room.id);
      const DTORoom = roomMapper.toDTO({ ...room, ...roomStatus });
      res.status(200).json(DTORoom);
    } catch (err) {
      return Controller.serverError(res, err);
    }
  };

  findAllRoom = async (req: Request, res: Response) => {
    try {
      const rooms = await roomDataStorage.findAll();

      const roomsBooking = rooms.map(async room => {
        const roomStatus = await this.roomStatus(room.id);
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

    try {
      const room = await roomDataStorage.findByNameColor(
        data.body.name,
        data.body.color
      );

      if (room) {
        return Controller.badRequest(
          res,
          "Bad Request: name and color must be uniques"
        );
      }

      const roomCreated = await roomDataStorage.create(data.body);
      const DTORoom = roomMapper.toDTO(roomCreated);

      return res.status(200).json(DTORoom);
    } catch (err) {
      return Controller.serverError(res, err);
    }
  };

  updateRoom = async (req: Request, res: Response) => {
    const data: IUpdateRoomRequest = <IUpdateRoomRequest>{
      params: req.params,
      body: roomMapper.toEntity(req.body)
    };

    try {
      const room = await roomDataStorage.findByNameColor(
        data.body.name,
        data.body.color,
        data.params.id
      );

      if (room) {
        return Controller.badRequest(
          res,
          "Bad Request: name and color must be uniques"
        );
      }

      const roomUpdated = await roomDataStorage.update({
        ...data.body,
        ...data.params
      });

      if (!roomUpdated) {
        return Controller.badRequest(res, "Bad Request: Room not exist");
      }

      const roomStatus = await this.roomStatus(roomUpdated.id);
      const DTORoom = roomMapper.toDTO({ ...roomUpdated, ...roomStatus });
      return res.status(200).json(DTORoom);
    } catch (err) {
      return Controller.serverError(res, err);
    }
  };

  findAvailableHours = async (req: Request, res: Response) => {
    const data: IGetHourParams = { params: req.params, query: req.query };

    // Create a new date for verify if it's valid
    const fromDate: Date = data.query.fromDate
      ? moment(data.query.fromDate).format("YYYY-MM-DD")
      : moment()
          .tz("America/Mexico_City")
          .format("YYYY-MM-DD");

    const isValidDate = date => date.toString() !== "Invalid date";

    if (!isEmpty(data.query.fromDate) && !isValidDate(fromDate)) {
      return Controller.badRequest(
        res,
        "Bad Request: fromDate must be a date in format YYYY-MM-DD"
      );
    }

    try {
      const room = await roomDataStorage.findById(data.params.id);

      if (!room) {
        return Controller.badRequest(res, "Room not exist");
      }

      const bookings = await Booking.findAll({
        where: {
          roomId: data.params.id,
          start: { [Op.gte]: `${fromDate}T08:00:00` },
          end: { [Op.lte]: `${fromDate}T18:00:00` }
        }
      });

      // Get hours when the conference room is reserved
      const getBookingHours = (booking: Booking) => {
        const parsedBooking = booking.toJSON();
        return {
          start: parsedBooking.start.toJSON().slice(11, 16),
          end: parsedBooking.end.toJSON().slice(11, 16)
        };
      };

      const occupiedHours: IHour[] = _.chain(bookings)
        .map(getBookingHours)
        .sortBy("start")
        .value();

      // Add to occupiedHours edge Hours
      occupiedHours.unshift({ start: "00:00", end: "08:00" });
      occupiedHours.push({ start: "18:00", end: "23:59" });

      // Get hours when the conference room is free
      const freeHours: IHour[] = _.chain(occupiedHours)
        .map((hour, i, arr) => {
          if (i < arr.length - 1) {
            return hour.end !== arr[i + 1].start
              ? { start: hour.end, end: arr[i + 1].start }
              : null;
          }
        })
        .filter()
        .value();

      return res.status(200).json(freeHours);
    } catch (err) {
      return Controller.serverError(res, err);
    }
  };
}

export default new RoomController();
