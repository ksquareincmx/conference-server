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
import {
  IGetProfileRequest,
  IUpdateProfileRequest
} from "./../../interfaces/ProfileInterfaces";
import { profileMapper } from "./../../mappers/ProfileMapper";

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
      this.findAllProfile
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
      this.findProfile
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
      this.updateProfile
    );

    return this.router;
  }

  findProfile = async (req: Request, res: Response) => {
    const data: IGetProfileRequest = { userId: req.params.id };
    try {
      const profile = await this.model.findOne({
        where: { userId: data.userId }
      });

      if (!profile) {
        return Controller.notFound(res);
      }

      const parsedProfile = JSON.parse(JSON.stringify(profile));
      const JSONProfile = profileMapper.toJSON(parsedProfile);

      res.status(200).json(JSONProfile);
    } catch (err) {
      return Controller.serverError(res, err);
    }
  };

  findAllProfile = async (req: Request, res: Response) => {
    const data: IGetProfileRequest = req.session.where;

    try {
      const profiles = await this.model.findAll({
        where: { userId: data.userId }
      });

      if (!profiles) {
        return Controller.notFound(res);
      }

      const parsedProfiles = JSON.parse(JSON.stringify(profiles));
      const JSONProfiles = parsedProfiles.map(profile =>
        profileMapper.toJSON(profile)
      );
      res.status(200).json(JSONProfiles);
    } catch (err) {
      return Controller.serverError(res, err);
    }
  };

  updateProfile = async (req: Request, res: Response) => {
    const data: IUpdateProfileRequest = <IUpdateProfileRequest>(
      profileMapper.toEntity({
        id: req.params.id,
        ...req.body
      })
    );

    try {
      const profile = await this.model.findOne({
        where: {
          userId: data.userId,
          id: data.id
        }
      });

      if (!profile) {
        return Controller.notFound(res);
      }

      const updatedProfile = await profile.update(data);
      const parsedProfile = JSON.parse(JSON.stringify(updatedProfile));
      const JSONProfile = profileMapper.toJSON(parsedProfile);
      res.status(200).json(JSONProfile);
    } catch (err) {
      return Controller.serverError(res, err);
    }
  };
}

const controller = new ProfileController();
export default controller;
