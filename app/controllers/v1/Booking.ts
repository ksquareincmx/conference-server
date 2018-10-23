import * as _ from "lodash";
import { Op } from "sequelize";
import { Controller } from "./../../libraries/Controller";
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

    @apiHeader { String }   Content-Type Application/Json
    @apiHeader { String }   Authorization Bearer [jwt token]

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
    @apiSuccess {Array<String>} body.attendes    Emails from users who will attend the event
  */

    this.router.get("/", validateJWT("access"), (req, res) =>
      this.findAllBooking(req, res)
    );

    /**
    @api {get} /api/v1/Booking/:id Get a Booking
    @apiPermission access
    @apiName GetAllBooking
    @apiGroup Booking

    @apiHeader { String }   Content-Type Application/Json
    @apiHeader { String }   Authorization Bearer [jwt token]

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
    @apiSuccess {Array<String>} body.attendes    Emails from users who will attend the event
    */

    this.router.get("/:id", validateJWT("access"), (req, res) =>
      this.findOneBooking(req, res)
    );

    /**
      @api {post} /api/v1/Booking/ Create a new Booking
      @apiPermission access (Enforces access only to owner)
      @apiName PostBooking
      @apiGroup Booking

      @apiHeader { String } Content-Type Application/Json
      @apiHeader { String } Authorization Bearer [jwt token]

      @apiParam {Object}    body                   Booking details
      @apiParam {Date}      body.start             Booking date start
      @apiParam {Date}      body.end               Booking date end
      @apiParam {String}    body.description       Booking description
      @apiParam {Number}    body.roomId            Booking room id
      @apiParam {Array<String>}  body.attendees    Emails from users who will attend the event

      @apiSuccess {Object}  body                   Booking details
      @apiSuccess {Number}  body.id                Booking id
      @apiSuccess {string}  body.description       Booking description
      @apiSuccess {Date}    body.start             Booking date start
      @apiSuccess {Date}    body.end               Booking date end
      @apiSuccess {Number}  body.userId            User's id who created the booking
      @apiSuccess {String}  body.eventId           Google calendar event's id
      @apiSuccess {Date}    body.updatedAt         Booking creation date
      @apiSuccess {Date}    body.createdAt         Booking update date
      @apiSuccess {Array<String>}  body.attendees    Emails from users who will attend the event

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
      @apiParam {Array<String>}  body.attendees    Emails from users who will attend the event

      @apiSuccess {Object}  body                   Booking details
      @apiSuccess {Number}  body.id                Booking id
      @apiSuccess {string}  body.description       Booking description
      @apiSuccess {Date}    body.start             Booking date start
      @apiSuccess {Date}    body.end               Booking date end
      @apiSuccess {Number}  body.userId            User's id who created the booking
      @apiSuccess {String}  body.eventId           Google calendar event's id
      @apiSuccess {Date}    body.updatedAt         Booking creation date
      @apiSuccess {Date}    body.createdAt         Booking update date
      @apiSuccess {Array<String>}  body.attendees    Emails from users who will attend the event

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

  destroyBooking(req: Request, res: Response) {
    let bookingId = req.params.id;

    this.model
      .findById(bookingId)
      .then(async result => {
        await calendarService.deleteEvent(result.eventId);
        this.destroy(req, res);
      })
      .catch(err => {
        return Controller.serverError(res);
      });
  }

  createBooking(req: Request, res: Response) {
    let description = req.body.description;
    let attendees = req.body.attendees;
    let startTime = req.body.start;
    let endTime = req.body.end;
    let roomId = req.body.roomId;
    attendees.push(req.session.user.email);

    if (description == null)
      return Controller.badRequest(
        res,
        "Bad Request: No description in request"
      );
    if (startTime == null)
      return Controller.badRequest(res, "Bad Request: No start in request.");
    if (endTime == null)
      return Controller.badRequest(res, "Bad Request: No end in request.");
    if (roomId == null)
      return Controller.badRequest(res, "Bad Request: No roomId in request");

    this.model
      .findAndCountAll({
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
      })
      .then(async result => {
        if (result.count === 0) {
          let eventCalendar = await calendarService.insertEvent(
            startTime,
            endTime,
            description,
            attendees
          );

          this.createBookingDB(req, res, eventCalendar.id, attendees);
        } else {
          Controller.noContent(res);
          throw null;
        }
      })
      .catch(err => {
        if (err !== null) Controller.serverError(res);
      });
  }

  createBookingDB(
    req: Request,
    res: Response,
    eventId: string,
    attendees: Array<string>
  ) {
    let values: any = req.body;
    values["eventId"] = eventId;
    if (!_.isObject(values))
      return Controller.serverError(res, new Error("Invalid data in body"));
    this.model
      .create(values)
      .then(async result => {
        attendees.forEach(async attendee => {
          let attendeeId = await insertAttendee(attendee);
          insertBookingAttendee(result.id, attendeeId);
        });
        result = JSON.parse(JSON.stringify(result, null, 2));
        result["attendees"] = attendees;

        res.status(201).json(result);
      })
      .catch(err => {
        if (err) Controller.serverError(res, err);
      });
  }

  updateBooking(req: Request, res: Response) {
    let description = req.body.description;
    let attendees = req.body.attendees;
    let startTime = req.body.start;
    let bookingId = req.params.id;
    let endTime = req.body.end;
    let room = req.body.roomId;
    attendees.push(req.session.user.email);

    let values: any = req.body;
    values.id = bookingId;

    if (startTime == null)
      return Controller.badRequest(res, "Bad Request: No start in request.");
    if (endTime == null)
      return Controller.badRequest(res, "Bad Request: No end in request.");
    if (room == null)
      return Controller.badRequest(res, "Bad Request: No roomId in request");

    this.model
      .findAndCountAll({
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
              [Op.eq]: room
            }
          }
        }
      })
      .then(result => {
        if (result.count === 0) {
          return this.model.findById(bookingId);
        } else {
          Controller.noContent(res);
          throw null;
        }
      })
      .then(async result => {
        if (!result) {
          res.status(404).end();
          throw null;
        } else {
          await calendarService.updateEvent(
            result.eventId,
            startTime,
            endTime,
            description,
            attendees
          );
          let updatedAttendees = await updateBookingAttendee(
            bookingId,
            attendees
          );

          result.update(values).then(async updatedResult => {
            let parsedResult = JSON.parse(
              JSON.stringify(updatedResult, null, 2)
            );
            parsedResult["attendees"] = updatedAttendees;
            res.status(200).json(parsedResult);
          });
        }
      })
      .catch(err => {
        if (err) return Controller.serverError(res);
      });
  }

  findOneBooking(req: Request, res: Response) {
    let bookingId = req.params.id;
    this.model
      .findById(bookingId)
      .then(async result => {
        if (!result) {
          res.status(404).end();
        } else {
          let parsedResult = JSON.parse(JSON.stringify(result, null, 2));
          let attendees = await getAttendees(bookingId);
          parsedResult["attendees"] = attendees.map(x => x["email"]);

          res.status(200).json(parsedResult);
        }
      })
      .catch(err => {
        return Controller.serverError(res, err);
      });
  }

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
