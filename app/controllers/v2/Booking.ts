import * as fp from "lodash/fp";

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
import { User } from "../../models/User";

export class BookingController extends Controller {
  constructor() {
    super();
    this.name = "booking";
    this.model = Booking;
  }

  routes(): Router {
    /**
    @api {get} /api/v2/booking Get Bookings
    @apiVersion 1.0.0
    @apiPermission access
    @apiName GetBooking
    @apiGroup Booking

    @apiHeader {string}   Content-Type Application/Json
    @apiHeader {string}   Authorization Bearer [jwt token]

    @apiParam {string[]} [include]    Relations details. Accepted: Room, User
    @apiParam {Date}     [start]      start date filter, a ISO 8601 date. Operations accepted: gte, lte
    @apiParam {Date}     [end]        end date filter, a ISO 8601 date. Operations accepted: gte, lte
    @apiParam {number}   [roomId]     roomId filter. Operations accepted eq
    @apiParam {string}   [order]      order bookings by param. accepted DESC | ASC
    @apiParam {number}   [page]       number of page. Returns page equal to 1 by default. Useful for pagination
    @apiParam {number}   [pageSize]   page size. Assign pageSize equal to 10 by default. Useful for pagination

    @apiParamExample include
    /api/v2/booking?include=["Room", "User"]
    @apiParamExample filters
    /api/v2/booking?start[gte]=2019-03-13T14:00:00Z&end[lte]=2019-03-13T22:00:00Z&roomId[eq]=1
    @apiParamExample order
    /api/v2/booking?order=start DESC
    @apiParamExample pagination
    /api/v2/booking?page=2&pageSize=12
  

    @apiSuccess {Object[]}  bookings                Booking details
    @apiSuccess {number}    bookings.id             Booking id
    @apiSuccess {string}    bookings.description    Booking description
    @apiSuccess {Date}      bookings.start          Booking start date
    @apiSuccess {Date}      bookings.end            Booking end date
    @apiSuccess {string}    bookings.event_id       Google calendar event's id
    @apiSuccess {number}    bookings.room_id        Booking room
    @apiSuccess {number}    bookings.user_id        User's id who created the booking
    @apiSuccess {Date}      bookings.updated_at     Booking creation date
    @apiSuccess {Date}      bookings.created_at     Booking update date
    @apiSuccess {string[]}  bookings.attendees      Emails from users who will attend the event
  */

    this.router.get(
      "/",
      validateJWT("access"),
      validate(bookingSchema.getBookings),
      this.findBookingsService
    );

    /**
    @api {get} /api/v2/Booking/:id Get a Booking
    @apiVersion 1.0.0
    @apiPermission access
    @apiName GetAllBooking
    @apiGroup Booking

    @apiHeader {string}   Content-Type Application/Json
    @apiHeader {string}   Authorization Bearer [jwt token]

    @apiSuccess {Object}   body                   Booking details
    @apiSuccess {number}   body.id                Booking id
    @apiSuccess {string}   body.description       Booking description
    @apiSuccess {Date}     body.start             Booking start date
    @apiSuccess {Date}     body.end               Booking end date
    @apiSuccess {string}   body.event_id          Google calendar event's id
    @apiSuccess {number}   body.room_id           Booking room
    @apiSuccess {number}   body.user_id           User's id who created the booking
    @apiSuccess {Date}     body.updated_at        Booking creation date
    @apiSuccess {Date}     body.created_at        Booking update date
    @apiSuccess {string[]} body.attendees         Emails from users who will attend the event
    */

    this.router.get("/:id", validateJWT("access"), this.findOneBooking);

    /**
      @api {post} /api/v2/booking Create a Booking
      @apiVersion 1.0.0
      @apiPermission access (Enforces access only to owner)
      @apiName PostBooking
      @apiGroup Booking

      @apiHeader {string} Content-Type Application/Json
      @apiHeader {string} Authorization Bearer [jwt token]

      @apiParam {Object}      body                   Booking details
      @apiParam {Date}        body.start             Booking start date
      @apiParam {Date}        body.end               Booking end date
      @apiParam {string}      body.description       Booking description
      @apiParam {number}      body.room_id           Booking room id
      @apiParam {string[]}    body.attendees         Emails from users who will attend the event

      @apiSuccess {Object}    body                   Booking details
      @apiSuccess {number}    body.id                Booking id
      @apiSuccess {number}    body.room_id           Booking room id
      @apiSuccess {string}    body.description       Booking description
      @apiSuccess {Date}      body.start             Booking start date
      @apiSuccess {Date}      body.end               Booking end date
      @apiSuccess {number}    body.user_id           User's id who created the booking
      @apiSuccess {string}    body.event_id          Google calendar event's id
      @apiSuccess {Date}      body.updated_at        Booking creation date
      @apiSuccess {Date}      body.created_at        Booking update date
      @apiSuccess {string[]}  body.attendees         Emails from users who will attend the event

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
      @api {put}   /api/v2/booking/:id  Modifies a Booking
      @apiVersion 1.0.0
      @apiPermission access (admin and owner)
      @apiName PutBooking
      @apiGroup Booking

      @apiHeader { string } Content-Type Application/Json
      @apiHeader { string } Authorization Bearer [jwt token]

      @apiParam {Object}     body                  Booking details
      @apiParam {Date}       body.start            Booking start date
      @apiParam {Date}       body.end              Booking end date
      @apiParam {string}     body.description      Booking description
      @apiParam {number}     body.room_id          Booking room id
      @apiParam {string[]}   body.attendees        Emails from users who will attend the event

      @apiSuccess {Object}    body                 Booking details
      @apiSuccess {number}    body.id              Booking id
      @apiSuccess {number}    body.room_id         Booking room id
      @apiSuccess {string}    body.description     Booking description
      @apiSuccess {Date}      body.start           Booking start date
      @apiSuccess {Date}      body.end             Booking end date
      @apiSuccess {number}    body.user_id         User's id who created the booking
      @apiSuccess {string}    body.event_id        Google calendar event's id
      @apiSuccess {Date}      body.updated_at      Booking creation date
      @apiSuccess {Date}      body.created_at      Booking update date
      @apiSuccess {string[]}  body.attendees       Emails from users who will attend the event

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
      @api {delete} /api/v2/booking/:id Removes a Booking
      @apiVersion 1.0.0
      @apiPermission access (admin and owner)
      @apiName deleteBooking
      @apiGroup Booking

      @apiHeader { string }   Content-Type Application/Json
      @apiHeader { string }   Authorization Bearer [jwt token]

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
      const room = await Room.findOne({
        attributes: ["id", "name"],
        where: { id: data.roomId }
      });

      if (!room) {
        return Controller.badRequest(
          res,
          `Bad Request: room ${data.roomId} not exist.`
        );
      }

      const { name: location } = room.toJSON();

      const booking: Booking = await bookingDataStorage.findCollisions(data);

      //if exist a booking that overlaps whit start and end
      if (booking) {
        return Controller.noContent(res);
      }

      // TODO: Refactor and do transaction of the code below
      // insert event in Google calendar and send invitations
      const eventCalendar = await calendarService.insertEvent(
        data.start,
        data.end,
        data.description,
        uniqueEmails,
        location
      );

      // insert booking the DB
      const bookingDao = await this.model.create({
        ...data,
        eventId: eventCalendar.id
      });

      // get the created booking with room and user details
      const createdBooking: Booking = await Booking.findById(bookingDao.id, {
        include: [Room, User]
      });
      const parsedBooking = createdBooking.toJSON();

      // insert attendee in the DB
      uniqueEmails.forEach(async attendee => {
        const attendeeId = await insertAttendee(attendee);
        await insertBookingAttendee(parsedBooking.id, attendeeId);
      });

      // remove sensible data from user
      const finalBooking = {
        ...fp.omit("user", parsedBooking),
        user: {
          ...fp.omit(["password", "role"], parsedBooking.user)
        },
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
      const room = await Room.findOne({
        attributes: ["id", "name"],
        where: { id: data.body.roomId }
      });

      if (!room) {
        return Controller.badRequest(
          res,
          `Bad Request: room ${data.body.roomId} not exist.`
        );
      }

      const { name: location } = room.toJSON();
      const bookings: Booking = await bookingDataStorage.findUpdatedCollisions({
        ...data.body,
        ...data.params
      });
      // if exist a booking that overlaps whit start and end
      if (bookings) {
        return Controller.noContent(res);
      }

      const booking = await this.model.findById(data.params.id);
      if (!booking) {
        return res.status(404).end();
      }

      // TODO: transsaction
      // update the event and send emails
      await calendarService.updateEvent(
        booking.eventId,
        data.body.start,
        data.body.end,
        data.body.description,
        uniqueEmails,
        location
      );

      // update tables: attende and bookingAttende
      const updatedAttendees = await updateBookingAttendee(
        data.params.id,
        uniqueEmails
      );
      const bookingDao: Booking = await booking.update({
        ...data.params,
        ...data.body
      });

      const updatedBooking: Booking = await Booking.findById(bookingDao.id, {
        include: [Room, User]
      });
      const parsedBooking = updatedBooking.toJSON();

      // remove sensible data from user
      const finalUpdatedBooking = {
        ...fp.omit("user", parsedBooking),
        user: {
          ...fp.omit(["password", "role"], parsedBooking.user)
        },
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
      const booking = await this.model.findById(data.params.id, {
        include: [Room, User]
      });
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
