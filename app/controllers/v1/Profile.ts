import { Controller } from "./../../libraries/Controller";
import { Profile } from "./../../models/Profile";
import { Request, Response, Router } from "express";
import {
  validateJWT,
  filterOwner,
  appendUser,
  stripNestedObjects
} from "./../../policies/General";
import {
  IGetProfileParams,
  IGetAllProfileSession,
  IUpdateProfileRequest
} from "../../interfaces/v1/ProfileInterfaces";
import { profileMapper } from "./../../mappers/v1/ProfileMapper";

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
    const data: IGetProfileParams = { params: req.params };
    try {
      const profile = await this.model.findOne({
        where: { userId: data.params.id }
      });

      if (!profile) {
        return Controller.notFound(res);
      }

      const parsedProfile = JSON.parse(JSON.stringify(profile));
      const DTOProfiles = profileMapper.toDTO(parsedProfile);

      res.status(200).json(DTOProfiles);
    } catch (err) {
      return Controller.serverError(res, err);
    }
  };

  findAllProfile = async (req: Request, res: Response) => {
    const data: IGetAllProfileSession = { where: req.session.where };

    try {
      const profiles = await this.model.findAll({
        where: { userId: data.where.userId }
      });

      if (!profiles) {
        return Controller.notFound(res);
      }

      const parsedProfiles = JSON.parse(JSON.stringify(profiles));
      const DTOProfile = parsedProfiles.map(profileMapper.toDTO);
      res.status(200).json(DTOProfile);
    } catch (err) {
      return Controller.serverError(res, err);
    }
  };

  updateProfile = async (req: Request, res: Response) => {
    const data: IUpdateProfileRequest = <IUpdateProfileRequest>{
      params: req.params,
      body: profileMapper.toEntity(req.body)
    };

    try {
      const profile = await this.model.findOne({
        where: {
          userId: data.body.userId,
          id: data.params.id
        }
      });

      if (!profile) {
        return Controller.notFound(res);
      }

      const updatedProfile = await profile.update({
        ...data.params,
        ...data.body
      });
      const parsedProfile = JSON.parse(JSON.stringify(updatedProfile));
      const DTOProfiles = profileMapper.toDTO(parsedProfile);
      res.status(200).json(DTOProfiles);
    } catch (err) {
      return Controller.serverError(res, err);
    }
  };
}

const controller = new ProfileController();
export default controller;
