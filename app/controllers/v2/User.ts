import { Controller } from "./../../libraries/Controller";
import { User } from "./../../models/User";
import { Request, Response, Router } from "express";
import { validateJWT, isSelfUser, filterRoles } from "./../../policies/General";
import { userMapper } from "../../mappers/v2/UserMapper";
import { IGetUserParams } from "../../interfaces/v2/UserInterfaces";

export class UserController extends Controller {
  constructor() {
    super();
    this.name = "user";
    this.model = User;
  }

  routes(): Router {
    /**
        @api {get} /api/v1/Users/:id Get an User
        @apiPermission access
        @apiName getUser
        @apiGroup User

        @apiHeader { String }   Content-Type Application/Json
        @apiHeader { String }   Authorization Bearer [jwt token]

        @apiSuccess  {Object}   body                 User details
        @apiSuccess  {String}   body.authProviderId  Id of the authProvider db element associated with the user.
        @apiSuccess  {String}   body.picture         The URL of the user profile picture (provided by google)
        @apiSuccess  {String}   body.name            User name
        @apiSuccess  {String}   body.email           User email
        @apiSuccess  {String}   body.password        User password
        @apiSuccess  {String}   body.role            User role ("user", "admin")
    */

    this.router.get("/:id", validateJWT("access"), this.findOneUser);

    /**
        @api {put} /api/v1/Users/:id Modify an User
        @apiPermission access (only admin can edit user)
        @apiName putUser
        @apiGroup User

        @apiHeader { String }   Content-Type Application/Json
        @apiHeader { String }   Authorization Bearer [jwt token]

        @apiParam    {Object}   body                 User details
        @apiParam    {String}   body.authProviderId  Id of the authProvider db element associated with the user.
        @apiParam    {String}   body.picture         The URL of the user profile picture (provided by google)
        @apiParam    {String}   body.name            User name
        @apiParam    {String}   body.email           User email
        @apiParam    {String}   body.password        User password
        @apiParam    {String}   body.role            User role ("user", "admin")

        @apiSuccess  {Object}   body                 User details
        @apiSuccess  {String}   body.authProviderId  Id of the authProvider db element associated with the user.
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

  findOneUser = async (req: Request, res: Response) => {
    const data: IGetUserParams = { params: req.params };

    try {
      const user = await this.model.findById(data.params.id);

      if (!user) {
        return Controller.notFound(res);
      }

      const DTOUser = userMapper.toDTO(user.toJSON());
      res.status(200).json(DTOUser);
    } catch (err) {
      return Controller.serverError(res, err);
    }
  };
}

export default new UserController();
