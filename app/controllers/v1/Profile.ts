import { Controller } from "./../../libraries/Controller";
import { Profile } from "./../../models/Profile";
import { Request, Response, Router } from "express";
import {
  validateJWT,
  filterOwner,
  appendUser,
  stripNestedObjects,
  filterRoles
} from "./../../policies/General";

export class ProfileController extends Controller {
  constructor() {
    super();
    this.name = "profile";
    this.model = Profile;
  }

  routes(): Router {

  /**
      @api {get} /api/v1/Profile/ Get a list of Profile
      @apiPermission access (Enforces access only to owner)
      @apiName getAllProfiles
      @apiGroup Profile

      @apiHeader { String }   Content-Type Application/Json
      @apiHeader { String }   Authorization Bearer [jwt token]

      @apiSuccess  {Object[]}   body                    Profile details
      @apiSuccess  {String}     body.time_zone          Profile time zone
      @apiSuccess  {String}     body.locale             Profile locale ("en", "es")
      @apiSuccess  {Number}     body.userId             User id
  */

    this.router.get(
      "/",
      validateJWT("access"),
      filterOwner(),
      (req, res) => this.find(req, res)
    );

    /**
        @api {get} /api/v1/Profile/:id Get a Profile
        @apiPermission access (Enforces access only to owner)
        @apiName getProfile
        @apiGroup Profile

        @apiHeader { String }   Content-Type Application/Json
        @apiHeader { String }   Authorization Bearer [jwt token]

        @apiParam    {Number}     id                      Profile id

        @apiSuccess  {Object}     body                    Profile details
        @apiSuccess  {String}     body.time_zone          Profile time zone
        @apiSuccess  {String}     body.locale             Profile locale ("en", "es")
        @apiSuccess  {Number}     body.userId             User id
    */

    this.router.get(
      "/:id",
      validateJWT("access"),
      filterOwner(),
      (req, res) => this.findOne(req, res)
    );

    /**
        @api {put} /api/v1/Profile/:id  Modify a Profile
        @apiPermission access (Enforces access only to owner)
        @apiName putProfile
        @apiGroup Profile

        @apiHeader { String }   Content-Type Application/Json
        @apiHeader { String }   Authorization Bearer [jwt token]

        @apiParam    {Number}   id                      Profile id

        @apiParam    {Object}   body                    Profile details
        @apiParam    {String}   body.time_zone          Profile time zone
        @apiParam    {String}   body.locale             Profile locale ("en", "es")
        @apiParam    {Number}   body.userId             User id

        @apiSuccess  {Object}   body                    Profile details
        @apiSuccess  {String}   body.time_zone          Profile time zone
        @apiSuccess  {String}   body.locale             Profile locale ("en", "es")
        @apiSuccess  {Number}   body.userId             User id
    */

    this.router.put(
      "/:id",
      validateJWT("access"),
      stripNestedObjects(),
      filterOwner(),
      appendUser(),
      (req, res) => this.update(req, res)
    );

    return this.router;
  }
}

const controller = new ProfileController();
export default controller;
