import { Controller } from "./../../libraries/Controller";
import { User } from "./../../models/User";
import { Request, Response, Router } from "express";
import { validateJWT, isSelfUser, filterRoles } from "./../../policies/General";

export class UserController extends Controller {
  constructor() {
    super();
    this.name = "user";
    this.model = User;
  }

  routes(): Router {

    /**
        @api {get} /api/v1/Users/:id Get an User
        @apiPermission access (Checks if the requested user is self)
        @apiName getUser
        @apiGroup User

        @apiHeader { String }   Content-Type Application/Json
        @apiHeader { String }   Authorization Bearer [jwt token]

        @apiSuccess  {Object}   body                 User details
        @apiSuccess  {String}   body.googleId        User google id
        @apiSuccess  {String}   body.picture         The URL of the user profile picture (provided by google)
        @apiSuccess  {String}   body.name            User name
        @apiSuccess  {String}   body.email           User email
        @apiSuccess  {String}   body.password        User password
        @apiSuccess  {String}   body.role            User role ("user", "admin")
    */

    this.router.get(
      "/:id",
      validateJWT("access"),
      isSelfUser(),
      (req, res) => this.findOne(req, res)
    );

    /**
        @api {put} /api/v1/Users/:id Modify an User
        @apiPermission access (only admin can edit user)
        @apiName putUser
        @apiGroup User

        @apiHeader { String }   Content-Type Application/Json
        @apiHeader { String }   Authorization Bearer [jwt token]

        @apiParam    {Object}   body                 User details
        @apiParam    {String}   body.googleId        User google id
        @apiParam    {String}   body.picture         The URL of the user profile picture (provided by google)
        @apiParam    {String}   body.name            User name
        @apiParam    {String}   body.email           User email
        @apiParam    {String}   body.password        User password
        @apiParam    {String}   body.role            User role ("user", "admin")

        @apiSuccess  {Object}   body                 User details
        @apiSuccess  {String}   body.googleId        User google id
        @apiSuccess  {String}   body.picture         The URL of the user profile picture (provided by google)
        @apiSuccess  {String}   body.name            User name
        @apiSuccess  {String}   body.email           User email
        @apiSuccess  {String}   body.password        User password
        @apiSuccess  {String}   body.role            User role ("user", "admin")
    */

    this.router.put(
      "/:id",
      validateJWT("access"),
      filterRoles(["admin"]),
      (req, res) => this.update(req, res)
    ); // only admin can edit user

    /**
        @api {delete} /api/v1/Users/:id Delete an User
        @apiPermission access (only admin can delete user)
        @apiName deleteUser
        @apiGroup User

        @apiHeader { String }   Content-Type Application/Json
        @apiHeader { String }   Authorization Bearer [jwt token]
    */

    this.router.delete(
      "/:id",
      validateJWT("access"),
      filterRoles(["admin"]),
      (req, res) => this.destroy(req, res)
    ); // only admin can delete user

    return this.router;
  }
}

const controller = new UserController();
export default controller;
