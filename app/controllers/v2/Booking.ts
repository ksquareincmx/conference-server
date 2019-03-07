import { config } from "./../../config/config";
import * as moment from "moment-timezone";
import * as _ from "lodash";
import { Op } from "sequelize";
import { Controller } from "./../../libraries/Controller";
import {
  isEmpty,
  getActualDate,
  isAvailableDate
} from "./../../libraries/util";
import { Booking } from "./../../models/Booking";
import { Room } from "./../../models/Room";
import { Request, Response, Router } from "express";
import {
  validateJWT,
  filterOwner,
  appendUser,
  stripNestedObjects,
  adminOrOwner
} from "./../../policies/General";
import calendarService from "./../../services/GoogleCalendarService";
import { insertAttendee } from "./../../libraries/AttendeeDB";
import {
  insertBookingAttendee,
  getAttendees,
  updateBookingAttendee
} from "./../../libraries/BookingAttendeeDB";
import {
  bookingMapper,
  createBookingMapper,
  updateBookingMapper
} from "../../mappers/v2/BookingMapper";
import {
  IGetBookingParams,
  IGetBookingsParams,
  IDeleteBookingParams,
  IBookingResponse
} from "../../interfaces/v2/BookingInterfaces";
import { validate } from "./../../policies/Validate";
import { bookingSchema } from "./../../policies/DataSchemas/Booking";
import { bookingDataStorage } from "./../../dataStorage/SQLDatastorage/Booking";
import { BookingAttendee } from "../../models/BookingAttendee";
import { Attendee } from "../../models/Attendee";

export class BookingController extends Controller {
  constructor() {
    super();
    this.name = "booking";
    this.model = Booking;
  }

  routes(): Router {
    /**
    @api {get} /api/v1/Booking/ Gets a list of Booking
    @apiPermission access
    @apiName GetBooking
    @apiGroup Booking

    @apiHeader {String}   Content-Type Application/Json
    @apiHeader {String}   Authorization Bearer [jwt token]

    @apiParam   {Date}   body.fromDate      Shows all bookings from a date
    @apiParam   {Date}   body.toDate        Show all bookings until a date

    @apiSuccess {Object[]}  body                   Booking details
    @apiSuccess {Number}  body.id                Booking id
    @apiSuccess {string}  body.description       Booking description
    @apiSuccess {Date}    body.start             Booking start date
    @apiSuccess {Date}    body.end               Booking end date
    @apiSuccess {String}  body.eventId           Google calendar event's id
    @apiSuccess {Number}  body.roomId            Booking room
    @apiSuccess {Number}  body.userId            User's id who created the booking
    @apiSuccess {Date}    body.updatedAt         Booking creation date
    @apiSuccess {Date}    body.createdAt         Booking update date
    @apiSuccess {String[]} body.attendees    Emails from users who will attend the event
  */

    this.router.get(
      "/",
      validateJWT("access"),
      validate(bookingSchema.getBookings),
      this.findBookingsService
    );

    /**
    @api {get} /api/v1/Booking/:id Get a Booking
    @apiPermission access
    @apiName GetAllBooking
    @apiGroup Booking

    @apiHeader {String}   Content-Type Application/Json
    @apiHeader {String}   Authorization Bearer [jwt token]

    @apiSuccess {Object}  body                   Booking details
    @apiSuccess {Number}  body.id                Booking id
    @apiSuccess {string}  body.description       Booking description
    @apiSuccess {Date}    body.start             Booking start date
    @apiSuccess {Date}    body.end               Booking end date
    @apiSuccess {String}  body.eventId           Google calendar event's id
    @apiSuccess {Number}   body.roomId            Booking room
    @apiSuccess {Number}  body.userId            User's id who created the booking
    @apiSuccess {Date}    body.updatedAt         Booking creation date
    @apiSuccess {Date}    body.createdAt         Booking update date
    @apiSuccess {String[]} body.attendees    Emails from users who will attend the event
    */

    this.router.get("/:id", validateJWT("access"), this.findOneBooking);

    /**
      @api {post} /api/v1/Booking/ Create a new Booking
      @apiPermission access (Enforces access only to owner)
      @apiName PostBooking
      @apiGroup Booking

      @apiHeader {String} Content-Type Application/Json
      @apiHeader {String} Authorization Bearer [jwt token]

      @apiParam {Object}    body                   Booking details
      @apiParam {Date}      body.start             Booking start date
      @apiParam {Date}      body.end               Booking end date
      @apiParam {String}    body.description       Booking description
      @apiParam {Number}    body.roomId            Booking room id
      @apiParam {String[]}  body.attendees    Emails from users who will attend the event

      @apiSuccess {Object}  body                   Booking details
      @apiSuccess {Number}  body.id                Booking id
      @apiSuccess {Number}  body.roomId            Booking room id
      @apiSuccess {string}  body.description       Booking description
      @apiSuccess {Date}    body.start             Booking start date
      @apiSuccess {Date}    body.end               Booking end date
      @apiSuccess {Number}  body.userId            User's id who created the booking
      @apiSuccess {String}  body.eventId           Google calendar event's id
      @apiSuccess {Date}    body.updatedAt         Booking creation date
      @apiSuccess {Date}    body.createdAt         Booking update date
      @apiSuccess {String[]}  body.attendees    Emails from users who will attend the event

    */

    this.router.post(
      "/",
      validateJWT("access"),
      stripNestedObjects(),
      filterOwner(),
      appendUser(),
      validate(bookingSchema.createBooking),
      this.createBooking
    );

    /**
      @api {put}   /api/v1/Booking/:id  Modify a Booking
      @apiPermission access (admin and owner)
      @apiName PutBooking
      @apiGroup Booking

      @apiHeader { String } Content-Type Application/Json
      @apiHeader { String } Authorization Bearer [jwt token]

      @apiParam {Object}    body                   Booking details
      @apiParam {Date}      body.start             Booking start date
      @apiParam {Date}      body.end               Booking end date
      @apiParam {String}    body.description       Booking description
      @apiParam {Number}    body.roomId            Booking room id
      @apiParam {String[]}  body.attendees    Emails from users who will attend the event

      @apiSuccess {Object}  body                   Booking details
      @apiSuccess {Number}  body.id                Booking id
      @apiSuccess {Number}  body.roomId            Booking room id
      @apiSuccess {string}  body.description       Booking description
      @apiSuccess {Date}    body.start             Booking start date
      @apiSuccess {Date}    body.end               Booking end date
      @apiSuccess {Number}  body.userId            User's id who created the booking
      @apiSuccess {String}  body.eventId           Google calendar event's id
      @apiSuccess {Date}    body.updatedAt         Booking creation date
      @apiSuccess {Date}    body.createdAt         Booking update date
      @apiSuccess {String[]}  body.attendees    Emails from users who will attend the event

    */

    this.router.put(
      "/:id",
      validateJWT("access"),
      stripNestedObjects(),
      appendUser(),
      adminOrOwner(this.model),
      validate(bookingSchema.updateBooking),
      this.updateBooking
    );

    /**
      @api {delete} /api/v1/Booking/:id Removes a Booking
      @apiPermission access (admin and owner)
      @apiName deleteBooking
      @apiGroup Booking

      @apiHeader { String }   Content-Type Application/Json
      @apiHeader { String }   Authorization Bearer [jwt token]

    */

    this.router.delete(
      "/:id",
      validateJWT("access"),
      adminOrOwner(this.model),
      this.destroyBooking
    );

    return this.router;
  }

  bookingsPlusAttendees = async bookings => {
    // Add attendees to booking
    try {
      const bookingsWithAttendees = bookings.map(async booking => {
        const attendees = await getAttendees(booking.id);
        const bookingWithAttendees = {
          ...booking,
          attendees: attendees.map(attendee => attendee.email)
        };
        return bookingWithAttendees;
      });

      const finalBookings = await Promise.all(bookingsWithAttendees);
      return finalBookings;
    } catch (err) {
      throw err;
    }
  };

  destroyBooking = async (req: Request, res: Response) => {
    const data: IDeleteBookingParams = {
      params: req.params
    };

    try {
      const booking = await this.model.findById(data.params.id);

      if (!booking) {
        return Controller.notFound(res);
      }

      const parsedBooking = booking.toJSON();
      if (parsedBooking.end < getActualDate()) {
        return res
          .status(409)
          .send({ code: 409, message: "Cannot cancel a past meeting" });
      }

      await calendarService.deleteEvent(booking.eventId);
      this.destroy(req, res);
    } catch (err) {
      return Controller.serverError(res);
    }
  };

  createBooking = async (req: Request, res: Response) => {
    const data = createBookingMapper.toEntity(req.body);

    if (!isAvailableDate(data.start, data.end)) {
      return Controller.badRequest(
        res,
        "bad Request: The booking only can have office hours (Monday-Friday, 8AM-6PM)."
      );
    }

    // remove duplicate emails
    data.attendees.push(req.session.user.email);
    const uniqueEmails = [...new Set(data.attendees)];

    try {
      const roomId = await Room.findOne({
        attributes: ["id"],
        where: { id: data.roomId }
      });

      if (isEmpty(roomId)) {
        return Controller.badRequest(
          res,
          `Bad Request: room ${data.roomId} not exist.`
        );
      }

      const booking = await this.model.findAndCountAll({
        where: {
          [Op.and]: {
            [Op.not]: {
              [Op.or]: {
                end: {
                  [Op.lte]: data.start
                },
                start: {
                  [Op.gte]: data.end
                }
              }
            },
            roomId: {
              [Op.eq]: data.roomId
            }
          }
        }
      });
      //if exist a booking that overlaps whit start and end
      if (booking.count > 0) {
        return Controller.noContent(res);
      }

      // insert event in Google calendar and send invitations
      const eventCalendar = await calendarService.insertEvent(
        data.start,
        data.end,
        data.description,
        uniqueEmails
      );

      // insert booking the DB
      const bookingObj = { ...data, eventId: eventCalendar.id };
      const createdBooking = await this.model.create(bookingObj);
      const parsedCreatedBooking = createdBooking.toJSON();

      // insert attendee in the DB
      uniqueEmails.forEach(async attendee => {
        const attendeeId = await insertAttendee(attendee);
        await insertBookingAttendee(parsedCreatedBooking.id, attendeeId);
      });

      const finalBooking = {
        ...parsedCreatedBooking,
        attendees: uniqueEmails
      };

      const DTOBooking = bookingMapper.toDTO(finalBooking);
      res.status(201).json(DTOBooking);
    } catch (err) {
      return Controller.serverError(res, err);
    }
  };

  updateBooking = async (req: Request, res: Response) => {
    const data = updateBookingMapper.toEntity({
      params: req.params,
      body: req.body
    });

    if (!isAvailableDate(data.body.start, data.body.end)) {
      return Controller.badRequest(
        res,
        "bad Request: The booking only can have office hours (Monday-Friday, 8AM-6PM)."
      );
    }

    // remove duplicate emails
    data.body.attendees.push(req.session.user.email);
    const uniqueEmails = [...new Set(data.body.attendees)];

    try {
      const roomId = await Room.findOne({
        attributes: ["id"],
        where: { id: data.body.roomId }
      });

      if (isEmpty(roomId)) {
        return Controller.badRequest(
          res,
          `Bad Request: room ${data.body.roomId} not exist.`
        );
      }

      const bookings = await this.model.findAndCountAll({
        where: {
          [Op.and]: {
            [Op.not]: {
              [Op.or]: {
                end: {
                  [Op.lte]: moment(data.body.start)
                    .utc()
                    .format()
                },
                start: {
                  [Op.gte]: moment(data.body.end)
                    .utc()
                    .format()
                }
              }
            },
            id: {
              [Op.ne]: data.params.id
            },
            roomId: {
              [Op.eq]: data.body.roomId
            }
          }
        }
      });
      // if exist a booking that overlaps whit start and end
      if (bookings.count > 0) {
        return Controller.noContent(res);
      }

      const booking = await this.model.findById(data.params.id);
      if (!booking) {
        return res.status(404).end();
      }

      // update the event and send emails
      await calendarService.updateEvent(
        booking.eventId,
        data.body.start,
        data.body.end,
        data.body.description,
        uniqueEmails
      );

      // update tables: attende and bookingAttende
      const updatedAttendees = await updateBookingAttendee(
        data.params.id,
        uniqueEmails
      );
      const updatedBooking = await booking.update({
        ...data.params,
        ...data.body
      });
      const parsedUpdatedBooking = updatedBooking.toJSON();
      const finalUpdatedBooking = {
        ...parsedUpdatedBooking,
        attendees: updatedAttendees
      };
      const DTOBooking = bookingMapper.toDTO(finalUpdatedBooking);
      res.status(200).json(DTOBooking);
    } catch (err) {
      return Controller.serverError(res, err);
    }
  };

  findOneBooking = async (req: Request, res: Response) => {
    const data: IGetBookingParams = {
      params: req.params
    };

    try {
      const booking = await this.model.findById(data.params.id);
      if (!booking) {
        return Controller.notFound(res);
      }

      const parsedBooking = booking.toJSON();
      const attendees = await getAttendees(data.params.id);

      const finalBooking = {
        ...parsedBooking,
        attendees: attendees.map(attende => attende.email)
      };

      //interface
      const DTOBooking = bookingMapper.toDTO(finalBooking);
      res.status(200).json(DTOBooking);
    } catch (err) {
      Controller.serverError(res, err);
    }
  };

  findBookingsService = async (req: Request, res: Response) => {
    const data: IGetBookingsParams = {
      query: req.query
    };

    try {
      const { bookings, rows } = await bookingDataStorage.findAll(data.query);
      const DTOBookings: IBookingResponse[] = bookings.map(bookingMapper.toDTO);

      // Add pagination metadata
      const page: number = Number(data.query.page || 1);
      const size: number = Number(data.query.pageSize || config.api.limit);
      const pagination = {
        size,
        prev: page - 1 || null,
        next: page * size >= rows ? null : page + 1
      };

      return res
        .status(200)
        .json({ _pagination: pagination, bookings: DTOBookings });
    } catch (err) {
      return Controller.serverError(res, err);
    }
  };
}

export default new BookingController();
