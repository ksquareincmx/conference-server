import { Controller } from "./../../libraries/Controller";
import { User } from "./../../models/User";
import { AuthProvider } from "./../../models/AuthProvider";
import { Profile } from "./../../models/Profile";
import { JWTBlacklist } from "./../../models/JWTBlacklist";
import { Request, Response, Router } from "express";
import { log } from "./../../libraries/Log";
import { isEmpty } from "./../../libraries/util";
import { config } from "./../../config/config";
import { validateJWT } from "./../../policies/General";
import { OAuth2Client } from "google-auth-library";
import mailer from "./../../services/EmailService";
import * as _ from "lodash";
import * as moment from "moment";
import * as jwt from "jsonwebtoken";
import * as uuid from "uuid";

const gAuthClient = new OAuth2Client(config.auth.google.clientId);

export class AuthController extends Controller {
  constructor() {
    super();
    this.name = "auth";
  }

  routes(): Router {
    /*
      @api {post} /api/v1/auth/login/ Login
      @apiPermission none
      @apiName postLoginAuth
      @apiGroup Auth

      @apiHeader { String }   Content-Type Application/Json
      @apiHeader { String }   Authorization Bearer [jwt token]

      @apiParam {Object}  body                Login credentials
      @apiParam {String}  body.email          User email
      @apiParam {String}  body.password       User password

      @apiSuccess {Object}    body                       Success credentials
      @apiSuccess {String}    body.token                 JWT token
      @apiSuccess {Number}    body.expires               Token expiration time
      @apiSuccess {Object}    body.refresh_token         JWT refresh token data
      @apiSuccess {String}    body.refresh_token.token   JWT Refresh Token
      @apiSuccess {Number}    body.refresh_token.expires       Refresh token expiration time
      @apiSuccess {Number}    body.refresh_token.expires_in    Refresh token expiration time
      @apiSuccess {Object}    body.user                        User details
      @apiSuccess {Number}    body.user.id                     User id
      @apiSuccess {String}    body.user.name                   User name
      @apiSuccess {String}    body.user.email                  User email
      @apiSuccess {String}    body.user.role                   User role ("user", "admin")
      @apiSuccess {Object}    body.profile                     User profile
      @apiSuccess {Number}    body.profile.id                  User id
      @apiSuccess {String}    body.profile.timezone            Profile timezon
      @apiSuccess {String}    body.profile.locale              Profile locale
      @apiSuccess {Number}    body.profile.userId              User id
      @apiSuccess {String}    body.profile.createAt            User create date
      @apiSuccess {String}    body.profile.updateAt            User update date

    */

    this.router.post("/login", this.login);

    /**
      @api {post} /api/v1/auth/logout/ Logout
      @apiPermission access
      @apiName postLogoutAuth
      @apiGroup Auth

      @apiHeader { String }   Content-Type Application/Json
      @apiHeader { String }   Authorization Bearer [jwt token]

    */

    this.router.post("/logout", validateJWT("access"), this.logout);

    /**
      @api {post} /api/v1/auth/register/ Register
      @apiPermission none
      @apiName postRegisterAuth
      @apiGroup Auth

      @apiParam {Object}  body                Login credentials
      @apiParam {String}  body.email          User email
      @apiParam {String}  body.password       User password

      @apiSuccess {Object}    body                       Success credentials
      @apiSuccess {String}    body.token                 JWT token
      @apiSuccess {Number}    body.expires               Token expiration time
      @apiSuccess {Object}    body.refresh_token         JWT refresh token data
      @apiSuccess {String}    body.refresh_token.token   JWT Refresh Token
      @apiSuccess {Number}    body.refresh_token.expires       Refresh token expiration time
      @apiSuccess {Number}    body.refresh_token.expires_in    Refresh token expiration time
      @apiSuccess {Object}    body.user                        User details
      @apiSuccess {Number}    body.user.id                     User id
      @apiSuccess {String}    body.user.name                   User name
      @apiSuccess {String}    body.user.email                  User email
      @apiSuccess {String}    body.user.role                   User role ("user", "admin")
      @apiSuccess {Object}    body.profile                     User profile
      @apiSuccess {Number}    body.profile.id                  User id
      @apiSuccess {String}    body.profile.timezone            Profile timezon
      @apiSuccess {String}    body.profile.locale              Profile locale
      @apiSuccess {Number}    body.profile.userId              User id
      @apiSuccess {String}    body.profile.createAt            User create date
      @apiSuccess {String}    body.profile.updateAt            User update date

    */

    this.router.post("/register", this.register);

    /*
      @apiDescription Validates the reset token passed as a query param and redirects to a reset token UI
      @api {get} /api/v1/auth/reset?token=[token] Start the Reset Password flow
      @apiPermission none (requires a valid reset token as a query param)
      @apiName getResetAuth
      @apiGroup Auth

    */

    this.router.get("/reset", this.resetGet);

    /*
      @api {post} /api/v1/auth/reset/ Reset
      @apiPermission none
      @apiName postResetAuth
      @apiGroup Auth

      @apiHeader { String }   Content-Type Application/Json
      @apiHeader { String }   Authorization Bearer [jwt token]

      @apiParam {String}  body.email          User email
      @apiParam {String}  body.password       User password

      @apiSuccess {Object}    body                       Success credentials
      @apiSuccess {String}    body.token                 JWT token
      @apiSuccess {Number}    body.expires               Token expiration time
      @apiSuccess {Object}    body.refresh_token         JWT refresh token data
      @apiSuccess {String}    body.refresh_token.token   JWT Refresh Token
      @apiSuccess {Number}    body.refresh_token.expires       Refresh token expiration time
      @apiSuccess {Number}    body.refresh_token.expires_in    Refresh token expiration time
      @apiSuccess {Object}    body.user                        User details
      @apiSuccess {Number}    body.user.id                     User id
      @apiSuccess {String}    body.user.name                   User name
      @apiSuccess {String}    body.user.email                  User email
      @apiSuccess {String}    body.user.role                   User role ("user", "admin")
      @apiSuccess {Object}    body.profile                     User profile
      @apiSuccess {Number}    body.profile.id                  User id
      @apiSuccess {String}    body.profile.timezone            Profile timezon
      @apiSuccess {String}    body.profile.locale              Profile locale
      @apiSuccess {Number}    body.profile.userId              User id
      @apiSuccess {String}    body.profile.createAt            User create date
      @apiSuccess {String}    body.profile.updateAt            User update date

    */

    this.router.post("/reset", this.resetPost);

    /**
      @api {post} /api/v1/auth/change/ Change password
      @apiPermission access
      @apiName postChangeAuth
      @apiGroup Auth

      @apiHeader { String }   Content-Type Application/Json
      @apiHeader { String }   Authorization Bearer [jwt token]

      @apiParam {Object}     body              Change password data
      @apiParam {String}     body.email        User email
      @apiParam {String}     body.oldPass      User old password
      @apiParam {String}     body.newPass      User new password

      @apiSuccess {Object}    body                       Success credentials
      @apiSuccess {String}    body.token                 JWT token
      @apiSuccess {Number}    body.expires               Token expiration time
      @apiSuccess {Object}    body.refresh_token         JWT refresh token data
      @apiSuccess {String}    body.refresh_token.token   JWT Refresh Token
      @apiSuccess {Number}    body.refresh_token.expires       Refresh token expiration time
      @apiSuccess {Number}    body.refresh_token.expires_in    Refresh token expiration time
      @apiSuccess {Object}    body.user                        User details
      @apiSuccess {Number}    body.user.id                     User id
      @apiSuccess {String}    body.user.name                   User name
      @apiSuccess {String}    body.user.email                  User email
      @apiSuccess {String}    body.user.role                   User role ("user", "admin")
      @apiSuccess {Object}    body.profile                     User profile
      @apiSuccess {Number}    body.profile.id                  User id
      @apiSuccess {String}    body.profile.timezone            Profile timezon
      @apiSuccess {String}    body.profile.locale              Profile locale
      @apiSuccess {Number}    body.profile.userId              User id
      @apiSuccess {String}    body.profile.createAt            User create date
      @apiSuccess {String}    body.profile.updateAt            User update date

    */

    this.router.post("/change", validateJWT("access"), this.changePassword);

    /**
      @api {post} /api/v1/auth/refresh/ Refresh token
      @apiPermission refresh (valid refresh token present in Authorization header)
      @apiName postRefreshAuth
      @apiGroup Auth

      @apiHeader { String }   Content-Type Application/Json
      @apiHeader { String }   Authorization Bearer [jwt token]

      @apiSuccess {Object}    body                       Success credentials
      @apiSuccess {String}    body.token                 JWT token
      @apiSuccess {Number}    body.expires               Token expiration time
      @apiSuccess {Object}    body.refresh_token         JWT refresh token data
      @apiSuccess {String}    body.refresh_token.token   JWT Refresh Token
      @apiSuccess {Number}    body.refresh_token.expires       Refresh token expiration time
      @apiSuccess {Number}    body.refresh_token.expires_in    Refresh token expiration time
      @apiSuccess {Object}    body.user                        User details
      @apiSuccess {Number}    body.user.id                     User id
      @apiSuccess {String}    body.user.name                   User name
      @apiSuccess {String}    body.user.email                  User email
      @apiSuccess {String}    body.user.role                   User role ("user", "admin")
      @apiSuccess {Object}    body.profile                     User profile
      @apiSuccess {Number}    body.profile.id                  User id
      @apiSuccess {String}    body.profile.timezone            Profile timezon
      @apiSuccess {String}    body.profile.locale              Profile locale
      @apiSuccess {Number}    body.profile.userId              User id
      @apiSuccess {String}    body.profile.createAt            User create date
      @apiSuccess {String}    body.profile.updateAt            User update date

    */

    this.router.post("/refresh", validateJWT("refresh"), this.refreshToken);

    /**
      @api {post} /api/v1/auth/googleLogin/ Google login
      @apiPermission none
      @apiName postGoogleLoginAuth
      @apiGroup Auth

      @apiHeader { String }   Content-Type Application/Json
      @apiHeader { String }   Authorization Bearer [jwt token]

      @apiParam {Number}  idToken          token id

      @apiSuccess {Object}    body                       Success credentials
      @apiSuccess {String}    body.token                 JWT token
      @apiSuccess {Number}    body.expires               Token expiration time
      @apiSuccess {Object}    body.refresh_token         JWT refresh token data
      @apiSuccess {String}    body.refresh_token.token   JWT Refresh Token
      @apiSuccess {Number}    body.refresh_token.expires       Refresh token expiration time
      @apiSuccess {Number}    body.refresh_token.expires_in    Refresh token expiration time
      @apiSuccess {Object}    body.user                        User details
      @apiSuccess {Number}    body.user.id                     User id
      @apiSuccess {String}    body.user.name                   User name
      @apiSuccess {String}    body.user.email                  User email
      @apiSuccess {String}    body.user.role                   User role ("user", "admin")
      @apiSuccess {Object}    body.profile                     User profile
      @apiSuccess {Number}    body.profile.id                  User id
      @apiSuccess {String}    body.profile.timezone            Profile timezon
      @apiSuccess {String}    body.profile.locale              Profile locale
      @apiSuccess {Number}    body.profile.userId              User id
      @apiSuccess {String}    body.profile.createAt            User create date
      @apiSuccess {String}    body.profile.updateAt            User update date
    */

    this.router.post("/googlelogin", this.googleLogin);

    return this.router;
  }

  /**
   * @typedef {Object} User
   * @property {number} id - user's id.
   * @property {string} googleId - user's googleId.
   * @property {string} picture -url user's picture.
   * @property {string} name - user's name.
   * @property {string} email - user's email.
   * @property {string} password - user's password.
   * @property {string} role - 'user's role.
   */

  /**
   * @typedef {Object} TokenInfo
   * @property {string} token - token.
   * @property {number} expires - expiration date in miliseconds.
   * @property {number} expiresIn - expiration date in seconds.
   */

  /**
   * Returns the new token's information thats is assigned to an user.
   * @param {User} user - user to whom the new token is assigned.
   * @param {string} type - jwt's type : ("secret", "access", "refresh", "reset")
   * @return {TokenInfo} - token's information.
   */
  public createToken = (user: any, type: string) => {
    const expiryUnit: any = config.jwt[type].expiry.unit;
    const expiryLength = config.jwt[type].expiry.length;
    const expires = moment()
      .add(expiryLength, expiryUnit)
      .valueOf();
    const issued = Date.now();
    const expiresIn = (expires - issued) / 1000; // seconds

    const token = jwt.sign(
      {
        id: user.id,
        sub: config.jwt[type].subject,
        aud: config.jwt[type].audience,
        exp: expires,
        iat: issued,
        jti: uuid.v4(),
        email: user.email,
        role: user.role
      },
      config.jwt.secret
    );

    return {
      token,
      expires,
      expiresIn
    };
  };

  /** @typedef {Object} PartiallyUser
   *  @property {number} id - user's id
   *  @property {string} name - user's name
   *  @property {string} email - user's email
   *  @property {string} role - user's role
   */

  /** @typedef {Object} Profile
   *  @property {number} id - user's id.
   *  @property {string} timezone - profile's timezone.
   *  @property {string} locale - profile's locales.
   *  @property {number} userId - user's userId.
   *  @property {string} createAt - date of creation of the user in the DB
   *  @property {string} updateAt - date of update of the user in the DB.
   */

  /**
   * @typedef {Object} Credentials user's infomation.
   * @property {string} token - token value.
   * @property {number} expires - expiration date in miliseconds.
   * @property {TokenInfo} refresh_token - token.
   * @property {PartiallyUser} user - user's info.
   * @property {Profile} profile - user's profile.
   */

  /**
   * Returns the user's credentials
   * @param {User} user - user from whom get the credentials
   * @return {Credentials} - user's credential
   */
  protected getCredentials = (user: any): any => {
    // Prepare response object
    const token = this.createToken(user, "access");
    const refreshToken = this.createToken(user, "refresh");
    const credentials = {
      token: token.token,
      expires: token.expires,
      refresh_token: refreshToken,
      user: _.pick(user, ["id", "name", "email", "role"]),
      profile: user.profile
    };
    return credentials;
  };

  private sendEmailNewPassword = async (
    user: any,
    token: string,
    name?: string
  ) => {
    let subject = "Instructions for restoring your password";
    try {
      const info = await mailer.sendEmail(
        user.email,
        subject,
        "password_recovery",
        user.profile.locale,
        {
          url: `${config.urls.baseApi}/auth/reset?token=${token}`,
          name: name || user.email
        }
      );
      log.debug("Sending password recovery email to:", user.email, info);
      return info;
    } catch (error) {
      log.debug("An error has ocurrerred:", error.message);
    }
  };

  private sendEmailPasswordChanged = async (user: any, name?: string) => {
    let subject = "Password restored";
    try {
      const info = await mailer.sendEmail(
        user.email,
        subject,
        "password_changed",
        user.profile.locale,
        {
          name: name || user.email
        }
      );

      log.debug("Sending password changed email to:", user.email, info);
      return info;
    } catch (err) {
      log.debug(err.messsage);
    }
  };

  private handleResetEmail = async (email: string) => {
    try {
      const user = await User.findOne({
        where: { email: email },
        include: [{ model: Profile, as: "profile" }]
      });

      if (!user) {
        throw { error: "notFound", msg: "Email not found" };
      }

      // create reset token
      const token = this.createToken(user, "reset");
      const emailInfo = {
        token: token.token,
        name: user.name,
        email,
        user
      };

      return this.sendEmailNewPassword(
        emailInfo.user,
        emailInfo.token,
        emailInfo.name
      );
    } catch (err) {
      log.debug("An error has ocurred:", err.message);
    }
  };

  private handleResetChPass = async (token: string, password: string) => {
    try {
      const decodedjwt = await this.validateJWT(token, "reset");
      if (!decodedjwt) {
        throw { error: "unauthorized", msg: "Invalid Token" };
      }

      let user: any = await User.findOne({
        where: { id: decodedjwt },
        include: [{ model: Profile, as: "profile" }]
      });

      if (!user) {
        throw { error: "unauthorized" };
      }

      user.password = password;
      const savedUser = user.save();
      if (!savedUser) {
        throw { error: "serverError", msg: null };
      }
      // Blacklist JWT asynchronously
      JWTBlacklist.create({
        token: token,
        expires: decodedjwt.exp
      }).catch(err => {
        log.error(err);
      });

      // We send it asynchronously, we don't care if there is a mistake
      this.sendEmailPasswordChanged(user);

      const credentials: any = this.getCredentials(user);
      return credentials;
    } catch (err) {
      log.error(err);
      throw { error: "unauthorized", msg: err };
    }
  };

  /**
   * @typedef {object} DecodedJWT
   * @property {number} id - user's id.
   * @property {string} sub - subject.
   * @property {string} aud - audience.
   * @property {number} exp - expiration time.
   * @property {number} iat - issue at.
   * @property {string} jti - jwt id.
   * @property {string} email - user's email.
   * @property {string} role - user's role.

   */

  /**
   * Returns the decoded JWT, if it's invalid throw an error.
   * @param {string} token - token value.
   * @param {string} type - token type: ("secret", "access", "refresh", "reset").
   * @param {DecodedJWT} decodedjwt - decoded JSON Web Token.
   */
  public validateJWT = async (token: string, type: string) => {
    // Decode token
    try {
      const decodedjwt: any = jwt.verify(token, config.jwt.secret);
      const reqTime = Date.now();

      if (decodedjwt.exp <= reqTime) {
        throw new Error("Token expired");
      }
      // Check if token is early
      if (!_.isUndefined(decodedjwt.nbf) && reqTime <= decodedjwt.nbf) {
        throw new Error("This token is early.");
      }

      // If audience doesn't match
      if (config.jwt[type].audience !== decodedjwt.aud) {
        throw new Error("This token cannot be accepted for this domain.");
      }

      // If the subject doesn't match
      if (config.jwt[type].subject !== decodedjwt.sub) {
        throw new Error("This token cannot be used for this request.");
      }
      const blacklist = await JWTBlacklist.findOne({ where: { token: token } });

      if (!isEmpty(blacklist)) {
        throw new Error("This Token is blacklisted");
      }

      return decodedjwt;
    } catch (err) {
      throw { name: err.name, message: err.message };
    }
  };

  login = async (req: Request, res: Response) => {
    const email = req.body.email;
    const password = req.body.password;
    // Validate
    if (isEmpty(email) || isEmpty(password)) {
      return Controller.badRequest(res);
    }

    // Only accept logging by password for users without googleId
    try {
      const user = await User.findOne({
        where: { email, authProviderId: null },
        include: [{ model: Profile, as: "profile" }]
      });

      if (!isEmpty(user)) {
        const authenticate = await user.authenticate(password);
        if (authenticate) {
          const credentials: any = await this.getCredentials(user);
          return Controller.ok(res, credentials);
        } else {
          return Controller.unauthorized(res);
        }
      }
      // Need to add response in case user does not exist
    } catch (err) {
      log.error(err);
      return Controller.badRequest(res);
    }
  };

  logout = async (req: Request, res: Response) => {
    const token: string = req.session.jwtstring;
    const decodedjwt: any = req.session.jwt;
    if (_.isUndefined(token) || _.isUndefined(decodedjwt)) {
      return Controller.unauthorized(res);
    }

    // Put token in blacklist
    try {
      await JWTBlacklist.create({
        expires: decodedjwt.exp,
        token
      });
      Controller.ok(res);
      return null;
    } catch (err) {
      return Controller.serverError(res, err);
    }
  };

  refreshToken = async (req: Request, res: Response) => {
    // Refresh token has been previously authenticated in validateJwt as refresh token
    const refreshToken: string = req.session.jwtstring;
    const decodedjwt: any = req.session.jwt;
    const reqUser: any = req.session.user;
    // Put refresh token in blacklist
    try {
      await JWTBlacklist.create({
        token: refreshToken,
        expires: decodedjwt.exp
      });

      const user: any = await User.findOne({ where: { id: reqUser.id } });
      if (!user) {
        return Controller.unauthorized(res);
      }

      // Create new token and refresh token and send
      const credentials: any = this.getCredentials(user);
      return Controller.ok(res, credentials);
    } catch (err) {
      return Controller.serverError(res, err);
    }
  };

  register = async (req: Request, res: Response) => {
    const newUser = {
      email: req.body.email,
      password: req.body.password
    };

    // Optional extra params:
    const locale: string | undefined = req.body.locale;
    const timezone: string | undefined = req.body.timezone;

    // Validate
    if (newUser.email == null || newUser.password == null) {
      return Controller.badRequest(res);
    }
    // Email and password length should be validated on user create TODO test

    let user: any;

    try {
      const createdUser: any = await User.create(newUser);
      // We need to do another query because before the profile wasn't ready
      let user: any = await User.findOne({
        where: { id: createdUser.id },
        include: [{ model: Profile, as: "profile" }]
      });

      // Set extra params:
      if (locale != null) {
        user.profile.locale = locale;
      }
      if (timezone != null) {
        user.profile.time_zone = timezone;
      }

      const savedUserProfile = await user.profile.save();
      const credentials: any = this.getCredentials(user);
      return Controller.ok(res, credentials);
    } catch (err) {
      if (
        err.errors != null &&
        err.errors.length &&
        err.errors[0].type === "unique violation" &&
        err.errors[0].path === "email"
      ) {
        return Controller.forbidden(res, "email in use");
      } else if (err) return Controller.serverError(res, err);
    }
  };

  /*
    This can serve two different use cases:
      1. Request sending of recovery token via email (body: { email: '...' })
      2. Set new password (body: { token: 'mytoken', password: 'newpassword' })
  */
  resetPost = async (req: Request, res: Response) => {
    // Validate if case 2
    const token: string = req.body.token;
    const password: string = req.body.password;

    if (!_.isUndefined(token) && !_.isUndefined(password)) {
      try {
        const credentials = await this.handleResetChPass(token, password);
        return Controller.ok(res, credentials);
      } catch (err) {
        log.error(err);
        switch (err.error) {
          case "badRequest":
            return Controller.badRequest(res, err.msg);
          case "notFound":
            return Controller.notFound(res, err.msg);
          case "serverError":
            return Controller.serverError(res, err.msg);
          default:
            return Controller.serverError(res);
        }
      }
    }

    // Validate case 1
    const email: string = req.body.email;

    if (!_.isUndefined(email)) {
      try {
        const info = await this.handleResetEmail(email);
        log.info(info);
        Controller.ok(res);
      } catch (err) {
        log.error(err);
        switch (err.error) {
          case "badRequest":
            return Controller.badRequest(res, err.msg);
          case "notFound":
            return Controller.notFound(res, err.msg);
          case "serverError":
            return Controller.serverError(res, err.msg);
          default:
            return Controller.serverError(res);
        }
      }
    }

    return Controller.badRequest(res);
  };

  resetGet = async (req: Request, res: Response) => {
    const token: any = req.query.token;
    if (_.isUndefined(token)) {
      return Controller.unauthorized(res);
    }
    // Decode token
    try {
      const decodedjwt = await this.validateJWT(token, "reset");
      if (!decodedjwt) {
        Controller.unauthorized(res);
        return null;
      }

      res.redirect(`${config.urls.base}/recovery/#/reset?token=${token}`);
    } catch (err) {
      return Controller.unauthorized(res, err);
    }
  };

  changePassword = async (req: Request, res: Response) => {
    const email = req.body.email;
    const oldPass = req.body.oldPass;
    const newPass = req.body.newPass;
    // Validate
    if (isEmpty(email) || isEmpty(oldPass) || isEmpty(newPass) == null) {
      return Controller.badRequest(res);
    }

    // IMPORTANT: Check if email is the same as the one in the token
    if (email != req.session.jwt.email) {
      return Controller.unauthorized(res);
    }

    try {
      let user: any = await User.findOne<User>({
        where: { id: req.session.jwt.id },
        include: [{ model: Profile, as: "profile" }]
      });
      if (!isEmpty(user)) {
        const authenticate = await user.authenticate(oldPass);
        if (authenticate) {
          user.password = newPass;
          const savedUser = user.save();
          if (!savedUser) {
            return Controller.serverError(res);
          }
          const credentials = this.getCredentials(user);
          return Controller.ok(res, credentials);
        } else {
          return Controller.unauthorized(res);
        }
      }
    } catch (err) {
      log.error(err);
      return Controller.badRequest(res);
    }
  };

  googleLogin = async (req: Request, res: Response) => {
    const idToken = req.body.idToken;
    if (isEmpty(idToken)) {
      return Controller.badRequest(res);
    }
    try {
      const ticket = await gAuthClient.verifyIdToken({
        idToken,
        audience: config.auth.google.clientId
      });
      const payload = ticket.getPayload();
      const userId = payload["sub"];
      const domain = payload["hd"] || payload["email"].split("@")[1];
      const email = payload["email"];
      const name = payload["name"];
      const picture = payload["picture"];

      const isValidDomain = domain => {
        return !(config.auth.google.allowedDomains.indexOf(domain) < 0);
      };

      if (!isValidDomain(domain) || isEmpty(domain)) {
        return Controller.unauthorized(res, "Unauthorized domain");
      }

      // Check if user exists
      let user: User = await User.findOne({
        where: { email },
        include: [
          { model: Profile, as: "profile" },
          { model: AuthProvider, as: "authProvider" }
        ]
      });
      if (isEmpty(user)) {
        // Save provider credentials
        const authProvider: AuthProvider = await AuthProvider.create({
          providerName: "google",
          providerId: userId
        });
        // Create new user
        user = await User.create({
          email,
          name,
          picture,
          authProviderId: authProvider.id,
          password: "DUMMYPASS" // Won't be used, validated in login method
        });
        // We need to do another query because before the profile wasn't ready
        user = await User.findOne({
          where: { id: user.id },
          include: [
            { model: Profile, as: "profile" },
            { model: AuthProvider, as: "authProvider" }
          ]
        });
      }
      const credentials: any = this.getCredentials(user);
      return Controller.ok(res, credentials);
    } catch (err) {
      log.error("Error on Google Login", err);
      if (
        err.errors != null &&
        err.errors.length &&
        err.errors[0].type === "unique violation" &&
        err.errors[0].path === "email"
      ) {
        return Controller.forbidden(res, "email in use");
      } else if (err) return Controller.serverError(res, err);
    }
  };
}

const controller = new AuthController();
export default controller;
