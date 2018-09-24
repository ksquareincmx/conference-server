
import { Op } from 'sequelize'
import { Controller } from "./../../libraries/Controller";
import { Booking } from "./../../models/Booking";
import { Request, Response, Router } from "express";
import { validateJWT, filterOwner, appendUser, stripNestedObjects, filterRoles } from "./../../policies/General";

export class BookingController extends Controller {

  constructor() {
    super();
    this.name = "booking";
    this.model = Booking;
  }

  routes(): Router {


  /**
    @api {get} /api/v1/Booking/ Gets a list of Booking
    @apiPermission access (Enforces access only to owner)
    @apiName GetBooking
    @apiGroup Booking

    @apiHeader { String }   Content-Type Application/Json
    @apiHeader { String }   Authorization Bearer [jwt token]

    @apiSuccess {Object[]}  body                   Booking details
    @apiSuccess {Date}      body.start             Booking date start
    @apiSuccess {String}    body.description       Booking description
    @apiSuccess {Date}      body.end               Booking date end
    @apiSuccess {Number}    body.roomId            Booking room id
    @apiSuccess {Number}    body.userId            Booking user id

    @apiSuccess {Object}    body.room              Room details
    @apiSuccess {String}    body.room.name         Room name
    @apiSuccess {String}    body.room.color        Room color
    @apiSuccess {Boolean}   body.room.presence     Room presence

    @apiSuccess {Object}    body.user              User details
    @apiSuccess {String}    body.user.googleId     User google account id
    @apiSuccess {String}    body.user.picture      The URL of the user profile picture (provided by google)
    @apiSuccess {String}    body.user.name         User name
    @apiSuccess {String}    body.user.email        User email
    @apiSuccess {String}    body.user.password     User password (Minimum length 8 characters)
    @apiSuccess {String}    body.user.role         User role ("user", "admin")
  */

    this.router.get(
      "/",
      validateJWT("access"),
      filterOwner(),
      (req, res) => this.find(req, res)
    );

  /**
    @api {get} /api/v1/Booking/:id Get a Booking
    @apiPermission access (Enforces access only to owner)
    @apiName GetAllBooking
    @apiGroup Booking

    @apiHeader { String }   Content-Type Application/Json
    @apiHeader { String }   Authorization Bearer [jwt token]

    @apiParam   {Number}    body.id                Booking id

    @apiSuccess {Object}    body                   Booking details
    @apiSuccess {Date}      body.start             Booking date start
    @apiSuccess {String}    body.description       Booking description
    @apiSuccess {Date}      body.end               Booking date end
    @apiSuccess {Number}    body.roomId            Booking room id
    @apiSuccess {Number}    body.userId            Booking user id

    @apiSuccess {Object}    body.room              Room details
    @apiSuccess {String}    body.room.name         Room name
    @apiSuccess {String}    body.room.color        Room color
    @apiSuccess {Boolean}   body.room.presence     Room presence

    @apiSuccess {Object}    body.user              User details
    @apiSuccess {String}    body.user.googleId     User google account id
    @apiSuccess {String}    body.user.picture      The URL of the user profile picture (provided by google)
    @apiSuccess {String}    body.user.name         User name
    @apiSuccess {String}    body.user.email        User email
    @apiSuccess {String}    body.user.password     User password (Minimum length 8 characters)
    @apiSuccess {String}    body.user.role         User role ("user", "admin")
    */

    this.router.get(
      "/:id",
      validateJWT("access"),
      filterOwner(),
      (req, res) => this.findOne(req, res)
    );

    /**
      @api {post} /api/v1/Booking/ Create a new Booking
      @apiPermission access (Enforces access only to owner)
      @apiName PostBooking
      @apiGroup Booking

      @apiHeader { String } Content-Type Application/Json
      @apiHeader { String } Authorization Bearer [jwt token]

      @apiParam {Object}    body                   Booking
      @apiParam {Date}      body.start             Booking date start
      @apiParam {String}    body.description       Booking description
      @apiParam {Date}      body.end               Booking date end
      @apiParam {Number}    body.roomId            Booking room id

      @apiParam {Number}    body.userId            Booking user id

      @apiParam {Object}    body.room              Room details
      @apiParam {String}    body.room.name         Room name
      @apiParam {String}    body.room.color        Room color
      @apiParam {Boolean}   body.room.presence     Room presence
      @apiParam {Object}    body.user              User details
      @apiParam {String}    body.user.googleId     User google account id
      @apiParam {String}    body.user.picture      The URL of the user profile picture (provided by google)
      @apiParam {String}    body.user.name         User name
      @apiParam {String}    body.user.email        User email
      @apiParam {String}    body.user.password     User password (Minimum length 8 characters)
      @apiParam {String}    body.user.role         User role ("user", "admin")

      @apiSuccess {Object}    body                   Booking
      @apiSuccess {Date}      body.start             Booking date start
      @apiSuccess {String}    body.description       Booking description
      @apiSuccess {Date}      body.end               Booking date end
      @apiSuccess {Number}    body.roomId            Booking room id
      @apiSuccess {Number}    body.userId            Booking user id

      @apiSuccess {Object}    body.room              Room details
      @apiSuccess {String}    body.room.name         Room name
      @apiSuccess {String}    body.room.color        Room color
      @apiSuccess {Boolean}   body.room.presence     Room presence

      @apiSuccess {Object}    body.user              User details
      @apiSuccess {String}    body.user.googleId     User google account id
      @apiSuccess {String}    body.user.picture      The URL of the user profile picture (provided by google)
      @apiSuccess {String}    body.user.name         User name
      @apiSuccess {String}    body.user.email        User email
      @apiSuccess {String}    body.user.password     User password (Minimum length 8 characters)
      @apiSuccess {String}    body.user.role         User role ("user", "admin")
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
      @api {put} /api/v1/Booking/:id  Modify a Booking
      @apiPermission access (Enforces access only to owner)
      @apiName PutBooking
      @apiGroup Booking

      @apiHeader { String } Content-Type Application/Json
      @apiHeader { String } Authorization Bearer [jwt token]

      @apiParam {Object}    body                   Booking
      @apiParam {Date}      body.start             Booking date start
      @apiParam {String}    body.description       Booking description
      @apiParam {Date}      body.end               Booking date end
      @apiParam {Number}    body.roomId            Booking room id

      @apiParam {Number}    body.userId            Booking user id

      @apiParam {Object}    body.room              Room details
      @apiParam {String}    body.room.name         Room name
      @apiParam {String}    body.room.color        Room color
      @apiParam {Boolean}   body.room.presence     Room presence
      @apiParam {Object}    body.user              User details
      @apiParam {String}    body.user.googleId     User google account id
      @apiParam {String}    body.user.picture      The URL of the user profile picture (provided by google)
      @apiParam {String}    body.user.name         User name
      @apiParam {String}    body.user.email        User email
      @apiParam {String}    body.user.password     User password (Minimum length 8 characters)
      @apiParam {String}    body.user.role         User role ("user", "admin")

      @apiSuccess {Object}    body                   Booking
      @apiSuccess {Date}      body.start             Booking date start
      @apiSuccess {String}    body.description       Booking description
      @apiSuccess {Date}      body.end               Booking date end
      @apiSuccess {Number}    body.roomId            Booking room id
      @apiSuccess {Number}    body.userId            Booking user id

      @apiSuccess {Object}    body.room              Room details
      @apiSuccess {String}    body.room.name         Room name
      @apiSuccess {String}    body.room.color        Room color
      @apiSuccess {Boolean}   body.room.presence     Room presence

      @apiSuccess {Object}    body.user              User details
      @apiSuccess {String}    body.user.googleId     User google account id
      @apiSuccess {String}    body.user.picture      The URL of the user profile picture (provided by google)
      @apiSuccess {String}    body.user.name         User name
      @apiSuccess {String}    body.user.email        User email
      @apiSuccess {String}    body.user.password     User password (Minimum length 8 characters)
      @apiSuccess {String}    body.user.role         User role ("user", "admin")

    */

    this.router.put(
      "/:id",
      validateJWT("access"),
      stripNestedObjects(),
      filterOwner(),
      appendUser(),
      (req, res) => this.updateBooking(req, res)
    );

    /**
      @api {delete} /api/v1/Booking/:id Removes a Booking
      @apiPermission access
      @apiName deleteBooking
      @apiGroup Booking

      @apiHeader { String }   Content-Type Application/Json
      @apiHeader { String }   Authorization Bearer [jwt token]

    */
    this.router.delete(
      "/:id",
      validateJWT("access"),
      filterOwner(),
      (req, res) => this.destroy(req, res)
    );

    return this.router;
  }

  createBooking(req: Request, res: Response){

    let description = req.body.description;
    let startTime = req.body.start;
    let endTime = req.body.end;
    let room = req.body.roomId;

    if (description == null) return Controller.badRequest(res, "Bad Request: No description in request")
    if (startTime == null) return Controller.badRequest(res, "Bad Request: No start in request.");
    if (endTime == null) return Controller.badRequest(res, "Bad Request: No end in request.");
    if (room == null) return Controller.badRequest(res, "Bad Request: No roomId in request")

    this.model.findAndCountAll({
      where: {
        [Op.and]{
          [Op.not]: {
            [Op.or]: {
              end: {
                [Op.lte] : startTime
              },
              start: {
                [Op.gte] : endTime
              }
            }
          },
          roomId: {
            [Op.eq]: room
          }
        }
      }
    })
    .then(result => {
      if (result.count === 0){
        this.create(req, res);
      } else {
        return Controller.noContent(res);
      }
    })
    .catch(err => {
      Controller.serverError(res);
    });
  }

  updateBooking(req: Request, res: Response){

    let bookingId = req.params.id;
    let startTime = req.body.start;
    let endTime = req.body.end;
    let room = req.body.roomId;

    if (startTime == null) return Controller.badRequest(res, "Bad Request: No start in request.");
    if (endTime == null) return Controller.badRequest(res, "Bad Request: No end in request.");
    if (room == null) return Controller.badRequest(res, "Bad Request: No roomId in request")
    // TODO: Filter by id
    this.model.findAndCountAll({
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
      if (result.count === 0){
        this.update(req, res);
      } else {
        return Controller.noContent(res);
      }
    })
    .catch(err => {
      return Controller.serverError(res);
    });
  }
}

const booking = new BookingController();
export default booking;
