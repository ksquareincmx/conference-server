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

    @apiParam   {Boolean}   body.onlyFuture      Shows only the actual and futures booking

    @apiSuccess {Object[]}  body                   Booking details
    @apiSuccess {Number}  body.id                Booking id
    @apiSuccess {string}  body.description       Booking description
    @apiSuccess {Date}    body.start             Booking date start
    @apiSuccess {Date}    body.end               Booking date end
    @apiSuccess {String}  body.eventId           Google calendar event's id
    @apiSuccess {Numbe}   body.roomId            Booking room
    @apiSuccess {Number}  body.userId            User's id who created the booking
    @apiSuccess {Date}    body.updatedAt         Booking creation date
    @apiSuccess {Date}    body.createdAt         Booking update date
    @apiSuccess {String[]} body.attendes    Emails from users who will attend the event
  */

    this.router.get("/", validateJWT("access"), (req, res) =>
      this.findAllBooking(req, res)
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
    @apiSuccess {Date}    body.start             Booking date start
    @apiSuccess {Date}    body.end               Booking date end
    @apiSuccess {String}  body.eventId           Google calendar event's id
    @apiSuccess {Numbe}   body.roomId            Booking room
    @apiSuccess {Number}  body.userId            User's id who created the booking
    @apiSuccess {Date}    body.updatedAt         Booking creation date
    @apiSuccess {Date}    body.createdAt         Booking update date
    @apiSuccess {String[]} body.attendes    Emails from users who will attend the event
    */

    this.router.get("/:id", validateJWT("access"), (req, res) =>
      this.findOneBooking(req, res)
    );

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
      (req, res) => this.createBooking(req, res)
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
      (req, res) => this.updateBooking(req, res)
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
      (req, res) => this.destroyBooking(req, res)
    );

    return this.router;
  }

  destroyBooking = async (req: Request, res: Response) => {
    const bookingId = req.params.id;

    try {
      const booking = await this.model.findById(bookingId);
      await calendarService.deleteEvent(booking.eventId);
      this.destroy(req, res);
    } catch (err) {
      return Controller.serverError(res);
    }
  };

  createBooking = async (req: Request, res: Response) => {
    const description = req.body.description;
    const startTime = req.body.start;
    const endTime = req.body.end;
    const roomId = req.body.roomId;
    const attendees = req.body.attendees;

    if (isEmpty(description)) {
      return Controller.badRequest(
        res,
        "Bad Request: No description in request"
      );
    } else if (isEmpty(startTime)) {
      return Controller.badRequest(
        res,
        "Bad Request: No start date in request."
      );
    } else if (isEmpty(endTime)) {
      return Controller.badRequest(res, "Bad Request: No end date in request.");
    } else if (isEmpty(roomId)) {
      return Controller.badRequest(res, "Bad Request: No roomId in request");
    } else if (attendees.constructor !== Array) {
      return Controller.badRequest(
        res,
        "Bad Request: No attendes as Array in request"
      );
    }

    attendees.push(req.session.user.email);

    try {
      const booking = await this.model.findAndCountAll({
        where: {
          [Op.and]: {
            [Op.not]: {
              [Op.or]: {
                end: {
                  [Op.lte]: startTime
                },
                start: {
                  [Op.gte]: endTime
                }
              }
            },
            roomId: {
              [Op.eq]: roomId
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
        startTime,
        endTime,
        description,
        attendees
      );

      // insert booking the DB
      const bookingObj = { ...req.body, eventId: eventCalendar.id };
      const createdBooking = await this.model.create(bookingObj);
      const parsedCreatedBooking = JSON.parse(
        JSON.stringify(createdBooking, null, 2)
      );

      // insert attendee in the DB
      attendees.forEach(async attendee => {
        const attendeeId = await insertAttendee(attendee);
        await insertBookingAttendee(parsedCreatedBooking.id, attendeeId);
      });

      const finalBooking = { ...parsedCreatedBooking, attendees };
      res.status(201).json(finalBooking);
    } catch (err) {
      return Controller.serverError(res);
    }
  };

  updateBooking = async (req: Request, res: Response) => {
    const description = req.body.description;
    const startTime = req.body.start;
    const endTime = req.body.end;
    const roomId = req.body.roomId;
    const attendees = req.body.attendees;
    const bookingId = req.params.id;

    if (isEmpty(description)) {
      return Controller.badRequest(
        res,
        "Bad Request: No description in request"
      );
    } else if (isEmpty(startTime)) {
      return Controller.badRequest(
        res,
        "Bad Request: No start date in request."
      );
    } else if (isEmpty(endTime)) {
      return Controller.badRequest(res, "Bad Request: No end date in request.");
    } else if (isEmpty(roomId)) {
      return Controller.badRequest(res, "Bad Request: No roomId in request");
    } else if (attendees.constructor !== Array) {
      return Controller.badRequest(
        res,
        "Bad Request: No attendes as Array in request"
      );
    }

    attendees.push(req.session.user.email);
    const bookingObj = { ...req.body, id: bookingId };

    try {
      const bookings = await this.model.findAndCountAll({
        where: {
          [Op.and]: {
            [Op.not]: {
              [Op.or]: {
                end: {
                  [Op.lte]: startTime
                },
                start: {
                  [Op.gte]: endTime
                }
              }
            },
            id: {
              [Op.ne]: bookingId
            },
            roomId: {
              [Op.eq]: roomId
            }
          }
        }
      });
      //if exist a booking that overlaps whit start and end
      if (bookings.count > 0) {
        return Controller.noContent(res);
      }

      const booking = await this.model.findById(bookingId);
      if (!booking) {
        res.status(404).end();
      }

      // update the event and send emails
      await calendarService.updateEvent(
        booking.eventId,
        startTime,
        endTime,
        description,
        attendees
      );

      // update tables attende and bookingAttende
      const updatedAttendees = await updateBookingAttendee(
        bookingId,
        attendees
      );

      const updatedBooking = await booking.update(bookingObj);
      const parsedUpdatedBooking = JSON.parse(
        JSON.stringify(updatedBooking, null, 2)
      );
      const finalUpdatedBooking = {
        ...parsedUpdatedBooking,
        attendees: updatedAttendees
      };

      res.status(200).json(finalUpdatedBooking);
    } catch (err) {
      return Controller.serverError(res);
    }
  };

  findOneBooking = async (req: Request, res: Response) => {
    const bookingId = req.params.id;

    try {
      const booking = await this.model.findById(bookingId);
      if (!booking) {
        Controller.notFound(res);
      }

      const parsedBooking = JSON.parse(JSON.stringify(booking, null, 2));
      const attendees = await getAttendees(bookingId);

      const finalBooking = {
        ...parsedBooking,
        attendees: attendees.map(attende => attende.email)
      };

      res.status(200).json(finalBooking);
    } catch (err) {
      Controller.serverError(res, err);
    }
  };

  findAllBooking(req: Request, res: Response) {
    let onlyFuture = req.query.onlyFuture == "true";
    let filterDate: any = new Date("1999-01-01T00:00:00");

    // only show the actual booking (if exist) and the futures bookings
    // otherwise show all bookings
    if (onlyFuture) {
      let date = new Date();
      filterDate = date.toLocaleString("es-MX", {
        formatMatcher: "basic",
        timeZone: "America/Mexico_City"
      });
    }

    this.model
      .findAll({
        where: {
          end: { [Op.gte]: filterDate }
        }
      })
      .then(async result => {
        let parsedResult = JSON.parse(JSON.stringify(result, null, 2));
        let bookings = parsedResult.map(async booking => {
          let attendees = await getAttendees(booking.id);
          booking["attendees"] = attendees.map(x => x["email"]);
          return booking;
        });
        bookings = await Promise.all(bookings);
        res.status(200).json(bookings);
      })
      .catch(err => {
        return Controller.serverError(res, err);
      });
  }
}

const booking = new BookingController();
export default booking;
