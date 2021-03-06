import * as _ from "lodash";
import { Op } from "sequelize";
import { Controller } from "./../../libraries/Controller";
import {
  isEmpty,
  getActualDate,
  isAvailableDate,
  areValidsEmails
} from "./../../libraries/util";
import { Booking } from "./../../models/Booking";
import { Room } from "./../../models/Room";
import { Request, Response, Router } from "express";
import {
  validateJWT,
  filterOwner,
  appendUser,
  stripNestedObjects,
  filterRoles,
  adminOrOwner,
  isOwner
} from "./../../policies/General";
import calendarService from "./../../services/GoogleCalendarService";
import { insertAttendee } from "./../../libraries/AttendeeDB";
import {
  insertBookingAttendee,
  getAttendees,
  deleteAllBookingAttendee,
  updateBookingAttendee
} from "./../../libraries/BookingAttendeeDB";
import { bookingMapper } from "./../../mappers/v1/BookingMapper";
import {
  IGetBookingParams,
  IGetAllBookingParams,
  IDeleteBookingParams,
  ICreateBookingRequest,
  IUpdateBookingRequest
} from "../../interfaces/v1/BookingInterfaces";

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

    this.router.get("/", validateJWT("access"), this.findAllBooking);

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

  /**
   * @typedef {Object} Booking
   * @property {number} id - booking id
   * @property {string} description - booking description
   * @property {string} start - booking start date
   * @property {string} end - booking end date
   * @property {string} eventId - google calendar event id associate with booking
   * @property {number} roomId - booking room id
   * @property {number} userId - user who creates the booking
   * @property {string} createdAt - booking creation date
   * @property {string} updatedAt - booking update date
   */

  /**
   * @typedef {Object} BookingAttende
   * @property {Booking} booking - booking
   * @property {Array<string>} - booking's attendees
   */

  /**
   * Returns object with bookings propertys and his attendees
   * @param {Array<Booking>} bookings - array of booking
   * @return {Array<BookingAttende>}
   */
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
      return Controller.serverError(res, err);
    }
  };

  createBooking = async (req: Request, res: Response) => {
    const data: ICreateBookingRequest = <ICreateBookingRequest>{
      body: bookingMapper.toEntity(req.body)
    };

    if (isEmpty(data.body.description)) {
      return Controller.badRequest(
        res,
        "Bad Request: No description in request."
      );
    }
    if (isEmpty(data.body.start)) {
      return Controller.badRequest(
        res,
        "Bad Request: No start date in request."
      );
    }
    if (isEmpty(data.body.end)) {
      return Controller.badRequest(res, "Bad Request: No end date in request.");
    }
    if (isEmpty(data.body.roomId)) {
      return Controller.badRequest(res, "Bad Request: No roomId in request.");
    }
    if (data.body.attendees.constructor !== Array) {
      return Controller.badRequest(
        res,
        "Bad Request: No attendees as Array in request."
      );
    }
    if (getActualDate() > data.body.start) {
      return Controller.badRequest(
        res,
        "bad Request: Bookings in past dates aren't allowed."
      );
    }
    if (!isAvailableDate(data.body.start, data.body.end)) {
      return Controller.badRequest(
        res,
        "bad Request: The booking only can have office hours (Monday-Friday, 8AM-6PM)."
      );
    }
    if (!areValidsEmails(data.body.attendees)) {
      return Controller.badRequest(res, "Bad Request: Invalid email.");
    }

    // insert only if the author email don't exist in data
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

      const booking = await this.model.findAndCountAll({
        where: {
          [Op.and]: {
            [Op.not]: {
              [Op.or]: {
                end: {
                  [Op.lte]: data.body.start
                },
                start: {
                  [Op.gte]: data.body.end
                }
              }
            },
            roomId: {
              [Op.eq]: data.body.roomId
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
        data.body.start,
        data.body.end,
        data.body.description,
        uniqueEmails
      );

      // insert booking the DB
      const bookingObj = { ...data.body, eventId: eventCalendar.id };
      const createdBooking = await this.model.create(bookingObj);
      const parsedCreatedBooking = JSON.parse(
        JSON.stringify(createdBooking, null, 2)
      );

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
    const data: IUpdateBookingRequest = <IUpdateBookingRequest>{
      params: req.params,
      body: bookingMapper.toEntity(req.body)
    };

    if (isEmpty(data.body.description)) {
      return Controller.badRequest(
        res,
        "Bad Request: No description in request."
      );
    }
    if (isEmpty(data.body.start)) {
      return Controller.badRequest(
        res,
        "Bad Request: No start date in request."
      );
    }
    if (isEmpty(data.body.end)) {
      return Controller.badRequest(res, "Bad Request: No end date in request.");
    }
    if (isEmpty(data.body.roomId)) {
      return Controller.badRequest(res, "Bad Request: No roomId in request.");
    }
    if (data.body.attendees.constructor !== Array) {
      return Controller.badRequest(
        res,
        "Bad Request: No attendees as Array in request."
      );
    }
    if (getActualDate() > data.body.start) {
      return Controller.badRequest(
        res,
        "bad Request: Bookings in past dates aren't allowed."
      );
    }
    if (!isAvailableDate(data.body.start, data.body.end)) {
      return Controller.badRequest(
        res,
        "bad Request: The booking only can have office hours (Monday-Friday, 8AM-6PM)."
      );
    }
    if (!areValidsEmails(data.body.attendees)) {
      return Controller.badRequest(res, "Bad Request: Invalid email.");
    }

    // insert only if the author email don't exist in the request
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
                  [Op.lte]: data.body.start
                },
                start: {
                  [Op.gte]: data.body.end
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
      //if exist a booking that overlaps whit start and end
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
      const parsedUpdatedBooking = JSON.parse(
        JSON.stringify(updatedBooking, null, 2)
      );
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

      const parsedBooking = JSON.parse(JSON.stringify(booking, null, 2));
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

  findAllBooking = async (req: Request, res: Response) => {
    const data: IGetAllBookingParams = {
      query: req.query
    };

    const fromDate: Date = new Date(data.query.fromDate);
    const toDate: Date = new Date(data.query.toDate);

    const isValidDate = date => date.toString() !== "Invalid Date";

    try {
      if (!isEmpty(data.query.fromDate) && !isValidDate(fromDate)) {
        return Controller.badRequest(
          res,
          "Bad Request: fromDate must be a date in format YYYY-MM-DDTHH:MM."
        );
      }

      if (!isEmpty(data.query.toDate) && !isValidDate(toDate)) {
        return Controller.badRequest(
          res,
          "Bad Request: toDate must be a date in format YYYY-MM-DDTHH:MM."
        );
      }

      const dateRangeStrategy = async ({ fromDate, toDate }) => {
        if (isEmpty(fromDate) && isEmpty(toDate)) {
          return await this.model.findAll();
        } else if (!isEmpty(fromDate) && isEmpty(toDate)) {
          return await this.model.findAll({
            where: {
              end: { [Op.gte]: fromDate }
            }
          });
        } else if (isEmpty(fromDate) && !isEmpty(toDate)) {
          return await this.model.findAll({
            where: {
              start: { [Op.lte]: toDate }
            }
          });
        } else {
          return await this.model.findAll({
            where: {
              end: { [Op.gte]: fromDate },
              start: { [Op.lte]: toDate }
            }
          });
        } // Case where !isEmpty(fromDate) && !isEmpty(toDate)
      };

      const bookings = await dateRangeStrategy({
        fromDate: data.query.fromDate,
        toDate: data.query.toDate
      });

      const finalBookings = await this.bookingsPlusAttendees(
        bookings.map(booking => booking.toJSON())
      );

      const DTOBookings = finalBookings.map(bookingMapper.toDTO);
      return res.status(200).json(DTOBookings);
    } catch (err) {
      return Controller.serverError(res, err);
    }
  };
}

const booking = new BookingController();
export default booking;
