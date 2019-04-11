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
  IGetProfileParams,
  IGetAllProfileSession,
  IUpdateProfileRequest
} from "../../interfaces/v2/ProfileInterfaces";
import { profileMapper } from "../../mappers/v2/ProfileMapper";

export class ProfileController extends Controller {
  constructor() {
    super();
    this.name = "profile";
    this.model = Profile;
  }

  routes(): Router {
    /**
      @api {get} /api/v2/profile  Get a list of Profile
      @apiVersion 1.0.0
      @apiPermission access (Enforces access only to owner)
      @apiName getAllProfiles
      @apiGroup Profile

      @apiHeader { string }   Content-Type Application/Json
      @apiHeader { string }   Authorization Bearer [jwt token]

      @apiSuccess  {Object[]}   body                    Profile details
      @apiSuccess  {string}     body.time_zone          Profile time zone
      @apiSuccess  {string}     body.locale             Profile locale ("en", "es")
      @apiSuccess  {number}     body.userId             User id
  */

    this.router.get(
      "/",
      validateJWT("access"),
      filterOwner(),
      this.findAllProfile
    );

    /**
        @api {get} /api/v2/profile/:id Get a Profile
        @apiVersion 1.0.0
        @apiPermission access (Enforces access only to owner)
        @apiName getProfile
        @apiGroup Profile

        @apiHeader { string }   Content-Type Application/Json
        @apiHeader { string }   Authorization Bearer [jwt token]

        @apiParam    {number}     id                      Profile id

        @apiSuccess  {Object}     body                    Profile details
        @apiSuccess  {string}     body.time_zone          Profile time zone
        @apiSuccess  {string}     body.locale             Profile locale ("en", "es")
        @apiSuccess  {number}     body.userId             User id
    */

    this.router.get(
      "/:id",
      validateJWT("access"),
      filterOwner(),
      this.findProfile
    );

    /**
        @api {put} /api/v2/profile/:id  Modify a Profile
        @apiVersion 1.0.0
        @apiPermission access (Enforces access only to owner)
        @apiName putProfile
        @apiGroup Profile

        @apiHeader { string }   Content-Type Application/Json
        @apiHeader { string }   Authorization Bearer [jwt token]

        @apiParam    {number}   id                      Profile id

        @apiParam    {Object}   body                    Profile details
        @apiParam    {string}   body.time_zone          Profile time zone
        @apiParam    {string}   body.locale             Profile locale ("en", "es")
        @apiParam    {number}   body.userId             User id

        @apiSuccess  {Object}   body                    Profile details
        @apiSuccess  {string}   body.time_zone          Profile time zone
        @apiSuccess  {string}   body.locale             Profile locale ("en", "es")
        @apiSuccess  {number}   body.userId             User id
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

      const DTOProfiles = profileMapper.toDTO(profile.toJSON());

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

      const DTOProfile = profiles
        .map(profile => profile.toJSON())
        .map(profileMapper.toDTO);

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

      const DTOProfiles = profileMapper.toDTO(updatedProfile.toJSON());
      res.status(200).json(DTOProfiles);
    } catch (err) {
      return Controller.serverError(res, err);
    }
  };
}

export default new ProfileController();
