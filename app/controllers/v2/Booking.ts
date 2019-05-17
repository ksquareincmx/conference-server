import * as fp from "lodash/fp";
import "universal-isomorphic-fetch";

import { config } from "./../../config/config";
import * as moment from "moment-timezone";
import * as _ from "lodash";
import { Op } from "sequelize";
import { Controller } from "./../../libraries/Controller";
import {
  isEmpty,
  getActualDate,
  isAvailableDate,
  formatDateFromSlack,
  isWeekenedDay
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
import { slackService } from "../../services/SlackService";
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
import { IHour } from "../../interfaces/v2/HourInterfaces";
import { validate } from "./../../policies/Validate";
import { bookingSchema } from "./../../policies/DataSchemas/Booking";
import { roomDataStorage } from "./../../dataStorage/SQLDatastorage/Room";
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

    /**
     * @api {post} /api/v2/booking/slack_url/dialog/open Manage dialog open in slack
     * @apiVersion 2.0.0
     * @apiPermission access (users)
     * @apiName slackCommand
     * @apiGroup Booking
     *
     */
    this.router.post(
      `/${process.env.SLACK_CALLBACK_URL}/command`,
      this.manageCommand
    );

    /**
     * @api {post} /api/v2/booking/slack_url/component/interaction Manage component interaction
     * @apiVersion 2.0.0
     * @apiPermission access (users)
     * @apiName slackActions
     * @apiGroup Booking
     */
    this.router.post(
      `/${process.env.SLACK_CALLBACK_URL}/interaction`,
      this.manageInteraction
    );

    return this.router;
  }

  manageCommand = async (req: Request, res: Response) => {
    // best practice to respond with 200 status
    res.send("");
    const { trigger_id, text, response_url } = req.body;
    const [bookingService, id] = text.split(" ");
    try {
      if (bookingService === "delete") {
        const booking = await this.model.findById(parseInt(id));

        if (!booking) {
          return await slackService.sendMessage({
            type: "error",
            toURL: response_url,
            text: "Booking not found"
          });
        }

        const parsedBooking = booking.toJSON();
        if (parsedBooking.end < getActualDate()) {
          return await slackService.sendMessage({
            type: "error",
            toURL: response_url,
            text: "Can't cancel a past appointment"
          });
        }

        await Promise.all([
          calendarService.deleteEvent(booking.eventId),
          booking.destroy()
        ]);

        return await slackService.sendMessage({
          type: "success",
          toURL: response_url,
          text: `Booking with id: ${id} deleted`
        });
      }

      return await slackService.openDialog({
        trigger_id,
        dialogParams: {
          type: "select-room-and-date"
        }
      });
    } catch (error) {
      const { message } = error;
      res.status(500).json({ response_type: "ephemeral", text: message });
    }
  };

  manageInteraction = async (req: Request, res: Response) => {
    const payload = JSON.parse(req.body.payload);
    const { type, response_url } = payload;

    try {
      switch (type) {
        case "dialog_submission":
          const { callback_id, submission } = payload;
          if (callback_id === "select-date-and-room") {
            const { date, roomId } = submission;

            if (isWeekenedDay(date)) {
              return res.status(200).json({
                errors: [
                  {
                    name: "date",
                    error: "Can't do an appointment on weekends!"
                  }
                ]
              });
            }

            // This closes the dialog in slack
            res.send("");

            const availableHours = await this.getAvailableHoursForBooking({
              date,
              roomId
            });

            const roomFounded = await Room.findOne({
              attributes: ["id", "name"],
              where: { id: parseInt(roomId) }
            });

            const responseContent = {
              date,
              availableHours,
              room: roomFounded.toJSON()
            };

            return await slackService.sendDialogSubmitResponse({
              toURL: response_url,
              responseContent
            });
          }

          const { isValid, errors } = this.validateBooking(submission);
          if (!isValid) {
            return res.json({ errors });
          }

          res.send("");

          const { user } = payload;
          const createdBooking = await this.createBookingFromSlack({
            bookingInfo: submission
          });

          const { name: slackUserName } = user;
          const responseContent = {
            slackUserName,
            ...createdBooking
          };
          return await slackService.sendDialogSubmitResponse({
            toURL: response_url,
            responseContent
          });

        case "block_actions":
          res.send("");
          const { actions, trigger_id } = payload;
          const [action] = actions;
          const { value } = action;
          const [date, id, name] = value.split("_");
          const defaultValues = {
            date,
            room: {
              id,
              name
            }
          };

          if (value === "retry") {
            return await slackService.openDialog({
              trigger_id,
              dialogParams: {
                type: "select-room-and-date"
              }
            });
          }
          return await slackService.openDialog({
            trigger_id,
            dialogParams: {
              defaultValues,
              type: "new-appointment"
            }
          });
      }
    } catch (error) {
      const { message } = error;
      return slackService.sendMessage({
        toURL: response_url,
        type: "error",
        text: message
      });
    }
  };

  validateBooking = bookingInfo => {
    const { startDate, endDate } = formatDateFromSlack(bookingInfo);

    if (startDate === endDate) {
      return {
        isValid: false,
        errors: [
          {
            name: "startHour",
            error: "The appointment hours are the same!"
          },
          {
            name: "startMinute",
            error: "The appointment hours are the same!"
          },
          {
            name: "endHour",
            error: "The appointment hours are the same!"
          },
          {
            name: "endMinute",
            error: "The appointment hours are the same!"
          }
        ]
      };
    }

    if (!isAvailableDate(startDate, endDate)) {
      return {
        isValid: false,
        errors: [
          {
            name: "endHour",
            error:
              "The booking only can have office hours (Monday-Friday, 8AM-6PM)."
          },
          {
            name: "endMinute",
            error:
              "The booking only can have office hours (Monday-Friday, 8AM-6PM)."
          }
        ]
      };
    }

    const { description } = bookingInfo;
    if (!description) {
      return {
        isValid: false,
        errors: [
          {
            name: "description",
            error: "Please write some appointment description"
          }
        ]
      };
    }

    return { isValid: true, errors: [] };
  };

  createBookingFromSlack = async ({ bookingInfo }) => {
    const { startDate, endDate } = formatDateFromSlack(bookingInfo);

    try {
      const { roomId } = bookingInfo;
      const room = await Room.findOne({
        attributes: ["id", "name"],
        where: { id: parseInt(roomId) }
      });

      if (!room) {
        return Promise.reject(
          new Error(`Room ${bookingInfo.roomId} doesn't exist.`)
        );
      }

      const { name: location } = room.toJSON();
      const collisionsData = { start: startDate, end: endDate, roomId };
      const booking: Booking = await bookingDataStorage.findCollisions(
        collisionsData
      );

      // if exist a booking that overlaps whit start and end
      if (booking) {
        return Promise.reject(
          new Error(`There is a appointment overlaping in ${location}`)
        );
      }

      const dummyUser = await User.findOne({
        attributes: ["id", "email"],
        where: { id: process.env.SLACK_DUMMY_USER_ID }
      });

      if (!dummyUser) {
        return Promise.reject(new Error("Dummy user not exist."));
      }

      const { id: userId, email: dummyEmail } = dummyUser.toJSON();
      const attendees = bookingInfo.attendees
        ? [...bookingInfo.attendees.split(","), dummyEmail]
        : [dummyEmail];

      const uniqueEmails = [...new Set(attendees)];
      const { description } = bookingInfo;
      const eventCalendar = await calendarService.insertEvent(
        startDate,
        endDate,
        description,
        uniqueEmails,
        location
      );

      // insert booking the DB
      const data = {
        userId,
        roomId,
        description,
        uniqueEmails,
        start: startDate,
        end: endDate
      };
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

      return {
        startDate,
        endDate,
        location,
        description,
        attendees: uniqueEmails
      };
    } catch (error) {
      const { message } = error;
      return Promise.reject(new Error(message));
    }
  };

  getAvailableHoursForBooking = async ({ date, roomId }) => {
    const isValidDate = date => date.toString() !== "Invalid date";
    try {
      if (!isEmpty(date) && !isValidDate(date)) {
        return Promise.reject(
          new Error("Date must be a date in format YYYY-MM-DD")
        );
      }
      const room = await roomDataStorage.findById(roomId);
      if (!room) {
        return Promise.reject(new Error(`Room ${roomId} doesn't exist.`));
      }

      const bookings = await Booking.findAll({
        where: {
          roomId,
          start: {
            [Op.gte]: `${date}T08:00:00`,
            [Op.lte]: `${date}T23:00:00`
          }
        }
      });

      // Get hours when the conference room is reserved
      const getBookingHours = (booking: Booking) => {
        const parsedBooking = booking.toJSON();

        // Convert from UTC to local time
        const localStartDate = moment(parsedBooking.start)
          .tz("America/Mexico_city")
          .format();
        const localEndDate = moment(parsedBooking.end)
          .tz("America/Mexico_city")
          .format();

        return {
          start: localStartDate.slice(11, 16),
          end: localEndDate.slice(11, 16)
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

      return freeHours;
    } catch (error) {
      const { message } = error;
      return Promise.reject(new Error(message));
    }
  };

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
          `Bad Request: room ${data.body.roomId} doesn't exist.`
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
