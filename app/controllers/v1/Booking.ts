import * as _ from "lodash";
import { Op } from "sequelize";
import { Controller } from "./../../libraries/Controller";
import { isEmpty } from "./../../libraries/util";
import { Booking } from "./../../models/Booking";
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
import { bookingMapper } from "./../../mappers/BookingMapper";
import {
  IGetBooking,
  IGetAllBooking,
  IDeleteBooking,
  ICreateBooking,
  IUpdateBooking
} from "./../../interfaces/BookingInterfaces";

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

    @apiSuccess {Object[]}  body                   Booking details
    @apiSuccess {Number}  body.id                Booking id
    @apiSuccess {string}  body.description       Booking description
    @apiSuccess {Date}    body.start             Booking date start
    @apiSuccess {Date}    body.end               Booking date end
    @apiSuccess {String}  body.eventId           Google calendar event's id
    @apiSuccess {Number}  body.roomId            Booking room
    @apiSuccess {Number}  body.userId            User's id who created the booking
    @apiSuccess {Date}    body.updatedAt         Booking creation date
    @apiSuccess {Date}    body.createdAt         Booking update date
    @apiSuccess {String[]} body.attendes    Emails from users who will attend the event
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
    @apiSuccess {Date}    body.start             Booking date start
    @apiSuccess {Date}    body.end               Booking date end
    @apiSuccess {String}  body.eventId           Google calendar event's id
    @apiSuccess {Number}   body.roomId            Booking room
    @apiSuccess {Number}  body.userId            User's id who created the booking
    @apiSuccess {Date}    body.updatedAt         Booking creation date
    @apiSuccess {Date}    body.createdAt         Booking update date
    @apiSuccess {String[]} body.attendes    Emails from users who will attend the event
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
      @apiParam {Date}      body.start             Booking date start
      @apiParam {Date}      body.end               Booking date end
      @apiParam {String}    body.description       Booking description
      @apiParam {Number}    body.roomId            Booking room id
      @apiParam {String[]}  body.attendees    Emails from users who will attend the event

      @apiSuccess {Object}  body                   Booking details
      @apiSuccess {Number}  body.id                Booking id
      @apiSuccess {Number}  body.roomId            Booking room id
      @apiSuccess {string}  body.description       Booking description
      @apiSuccess {Date}    body.start             Booking date start
      @apiSuccess {Date}    body.end               Booking date end
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
      @apiParam {Date}      body.start             Booking date start
      @apiParam {Date}      body.end               Booking date end
      @apiParam {String}    body.description       Booking description
      @apiParam {Number}    body.roomId            Booking room id
      @apiParam {String[]}  body.attendees    Emails from users who will attend the event

      @apiSuccess {Object}  body                   Booking details
      @apiSuccess {Number}  body.id                Booking id
      @apiSuccess {Number}  body.roomId            Booking room id
      @apiSuccess {string}  body.description       Booking description
      @apiSuccess {Date}    body.start             Booking date start
      @apiSuccess {Date}    body.end               Booking date end
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
   * @property {string} start - booking date start
   * @property {string} end - booking date end
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
          attendes: attendees.map(attendee => attendee.email)
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
    const data = <IDeleteBooking>req.params;

    try {
      const booking = await this.model.findById(data.id);
      await calendarService.deleteEvent(booking.eventId);
      this.destroy(req, res);
    } catch (err) {
      return Controller.serverError(res);
    }
  };

  createBooking = async (req: Request, res: Response) => {
    const body = req.body;
    const data = <ICreateBooking>bookingMapper.toEntity(body);

    if (isEmpty(data.description)) {
      return Controller.badRequest(
        res,
        "Bad Request: No description in request"
      );
    } else if (isEmpty(data.start)) {
      return Controller.badRequest(
        res,
        "Bad Request: No start date in request."
      );
    } else if (isEmpty(data.end)) {
      return Controller.badRequest(res, "Bad Request: No end date in request.");
    } else if (isEmpty(data.roomId)) {
      return Controller.badRequest(res, "Bad Request: No roomId in request");
    } else if (data.attendees.constructor !== Array) {
      return Controller.badRequest(
        res,
        "Bad Request: No attendes as Array in request"
      );
    }

    // insert only if the author email don't exist in data
    if (!data.attendees.some(email => email === req.session.user.email)) {
      data.attendees.push(req.session.user.email);
    }

    try {
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
        data.attendees
      );

      // insert booking the DB
      const bookingObj = { ...data, eventId: eventCalendar.id };
      const createdBooking = await this.model.create(bookingObj);
      const parsedCreatedBooking = JSON.parse(
        JSON.stringify(createdBooking, null, 2)
      );

      // insert attendee in the DB
      data.attendees.forEach(async attendee => {
        const attendeeId = await insertAttendee(attendee);
        await insertBookingAttendee(parsedCreatedBooking.id, attendeeId);
      });

      const finalBooking = {
        ...parsedCreatedBooking,
        attendees: data.attendees
      };
      const JSONBooking = bookingMapper.toJSON(finalBooking);
      res.status(201).json(JSONBooking);
    } catch (err) {
      return Controller.serverError(res);
    }
  };

  updateBooking = async (req: Request, res: Response) => {
    const requestContent = { ...req.body, ...req.params };
    const data = <IUpdateBooking>bookingMapper.toEntity(requestContent);

    if (isEmpty(data.description)) {
      return Controller.badRequest(
        res,
        "Bad Request: No description in request"
      );
    } else if (isEmpty(data.start)) {
      return Controller.badRequest(
        res,
        "Bad Request: No start date in request."
      );
    } else if (isEmpty(data.end)) {
      return Controller.badRequest(res, "Bad Request: No end date in request.");
    } else if (isEmpty(data.roomId)) {
      return Controller.badRequest(res, "Bad Request: No roomId in request");
    } else if (data.attendees.constructor !== Array) {
      return Controller.badRequest(
        res,
        "Bad Request: No attendes as Array in request"
      );
    }

    // insert only if the author email don't exist in the request
    if (!data.attendees.some(email => email === req.session.user.email)) {
      data.attendees.push(req.session.user.email);
    }

    try {
      const bookings = await this.model.findAndCountAll({
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
            id: {
              [Op.ne]: data.id
            },
            roomId: {
              [Op.eq]: data.roomId
            }
          }
        }
      });
      //if exist a booking that overlaps whit start and end
      if (bookings.count > 0) {
        return Controller.noContent(res);
      }

      const booking = await this.model.findById(data.id);
      if (!booking) {
        return res.status(404).end();
      }

      // update the event and send emails
      await calendarService.updateEvent(
        booking.eventId,
        data.start,
        data.end,
        data.description,
        data.attendees
      );

      // update tables attende and bookingAttende
      const updatedAttendees = await updateBookingAttendee(
        data.id,
        data.attendees
      );

      const updatedBooking = await booking.update(data);
      const parsedUpdatedBooking = JSON.parse(
        JSON.stringify(updatedBooking, null, 2)
      );
      const finalUpdatedBooking = {
        ...parsedUpdatedBooking,
        attendees: updatedAttendees
      };
      const JSONBooking = bookingMapper.toJSON(finalUpdatedBooking);
      res.status(200).json(JSONBooking);
    } catch (err) {
      return Controller.serverError(res);
    }
  };

  findOneBooking = async (req: Request, res: Response) => {
    const data: IGetBooking = req.params;

    try {
      const booking = await this.model.findById(data.id);
      if (!booking) {
        return Controller.notFound(res);
      }

      const parsedBooking = JSON.parse(JSON.stringify(booking, null, 2));
      const attendees = await getAttendees(data.id);

      const finalBooking = {
        ...parsedBooking,
        attendees: attendees.map(attende => attende.email)
      };

      //interface
      const JSONBooking = bookingMapper.toJSON(finalBooking);
      res.status(200).json(JSONBooking);
    } catch (err) {
      Controller.serverError(res, err);
    }
  };

  findAllBooking = async (req: Request, res: Response) => {
    const data = <IGetAllBooking>req.query;
    const toDate: Date = new Date(data.fromDate);
    const isValidDate = date => date.toString() !== "Invalid Date";

    try {
      // TODO: Delete redundant code
      // Obtain all bookings
      if (isEmpty(data.fromDate)) {
        const bookings = await this.model.findAll();

        if (bookings) {
          const parsedBookings = JSON.parse(JSON.stringify(bookings));
          const finalBookings = await this.bookingsPlusAttendees(
            parsedBookings
          );
          const JSONBookings = finalBookings.map(bookingMapper.toJSON);
          return res.status(200).json(JSONBookings);
        }
      }

      // Obtain all bookings from a date
      else if (isValidDate(toDate)) {
        const bookings = await this.model.findAll({
          where: {
            end: { [Op.gte]: toDate }
          }
        });
        if (bookings) {
          const parsedBookings = JSON.parse(JSON.stringify(bookings));
          const finalBookings = await this.bookingsPlusAttendees(
            parsedBookings
          );

          const JSONBookings = finalBookings.map(bookingMapper.toJSON);
          return res.status(200).json(JSONBookings);
        }
      }

      return Controller.badRequest(
        res,
        "Bad Request: fromDate must be a date in format YYYY-MM-DDTHH:MM."
      );
    } catch (err) {
      return Controller.serverError(res, err);
    }
  };
}

const booking = new BookingController();
export default booking;
