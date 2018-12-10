import { Controller } from "./../../libraries/Controller";
import { User } from "./../../models/User";
import { Profile } from "./../../models/Profile";
import { JWTBlacklist } from "./../../models/JWTBlacklist";
import { Request, Response, Router } from "express";
import { log } from "./../../libraries/Log";
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

    */

    this.router.post("/googlelogin", this.googleLogin);

    return this.router;
  }

  public createToken(user: any, type: string) {
    let expiryUnit: any = config.jwt[type].expiry.unit;
    let expiryLength = config.jwt[type].expiry.length;
    let expires = moment()
      .add(expiryLength, expiryUnit)
      .valueOf();
    let issued = Date.now();
    let expires_in = (expires - issued) / 1000; // seconds

    let token = jwt.sign(
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
      expires_in: expires_in
    };
  }

  protected getCredentials(user: any): any {
    // Prepare response object
    let token = this.createToken(user, "access");
    let refreshToken = this.createToken(user, "refresh");
    let credentials = {
      token: token.token,
      expires: token.expires,
      refresh_token: refreshToken,
      user: _.pick(user, ["id", "name", "email", "role"]),
      profile: user.profile
    };
    return credentials;
  }

  private async sendEmailNewPassword(user: any, token: string, name?: string) {
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
  }

  private async sendEmailPasswordChanged(user: any, name?: string) {
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
  }

  private handleResetEmail(email: string): Promise<any> {
    return Promise.resolve(
      User.findOne({
        where: { email: email },
        include: [{ model: Profile, as: "profile" }]
      })
        .then(user => {
          if (!user) {
            throw { error: "notFound", msg: "Email not found" };
          }
          // Create reset token
          let token = this.createToken(user, "reset");
          return {
            token: token.token,
            email: email,
            name: user.name,
            user: user
          };
        })
        .then(emailInfo => {
          return this.sendEmailNewPassword(
            emailInfo.user,
            emailInfo.token,
            emailInfo.name
          );
        })
    );
  }

  private handleResetChPass(token: string, password: string): Promise<any> {
    return this.validateJWT(token, "reset")
      .then(decodedjwt => {
        if (!decodedjwt) {
          throw { error: "unauthorized", msg: "Invalid Token" };
        }
        // Save new password
        let results = {
          user: null
        };
        return User.findOne({
          where: { id: decodedjwt.id },
          include: [{ model: Profile, as: "profile" }]
        })
          .then(user => {
            if (!user) {
              throw { error: "unauthorized" };
            }
            results.user = user;
            user.password = password;
            return user.save();
          })
          .then(result => {
            if (!result) {
              throw { error: "serverError", msg: null };
            }

            // Blacklist JWT asynchronously
            JWTBlacklist.create({
              token: token,
              expires: decodedjwt.exp
            }).catch(err => {
              log.error(err);
            });

            this.sendEmailPasswordChanged(results.user); // We send it asynchronously, we don't care if there is a mistake

            let credentials: any = this.getCredentials(results.user);
            return credentials;
          })
          .catch(err => {
            log.error(err);
            throw { error: "badRequest", msg: err };
          });
      })
      .catch(err => {
        throw { error: "unauthorized", msg: err };
      });
  }

  public validateJWT(token: string, type: string): Promise<any> {
    // Decode token
    let decodedjwt: any;
    try {
      decodedjwt = jwt.verify(token, config.jwt.secret);
    } catch (err) {
      return Promise.reject(err);
    }
    let reqTime = Date.now();
    // Check if token expired
    if (decodedjwt.exp <= reqTime) {
      return Promise.reject("Token expired");
    }
    // Check if token is early
    if (!_.isUndefined(decodedjwt.nbf) && reqTime <= decodedjwt.nbf) {
      return Promise.reject("This token is early.");
    }

    // If audience doesn't match
    if (config.jwt[type].audience !== decodedjwt.aud) {
      return Promise.reject("This token cannot be accepted for this domain.");
    }

    // If the subject doesn't match
    if (config.jwt[type].subject !== decodedjwt.sub) {
      return Promise.reject("This token cannot be used for this request.");
    }

    // Check if blacklisted
    return Promise.resolve(
      JWTBlacklist.findOne({ where: { token: token } })
        .then(result => {
          // if exists in blacklist, reject
          if (result != null)
            return Promise.reject("This Token is blacklisted.");
          return Promise.resolve(decodedjwt);
        })
        .catch(err => {
          return Promise.reject(err);
        })
    );
  }

  login(req: Request, res: Response) {
    let email = req.body.email;
    let password = req.body.password;
    // Validate
    if (email == null || password == null) return Controller.badRequest(res);

    let results = {
      user: null
    };

    // Only accept logging by password for users without googleId
    User.findOne({
      where: { email: email, googleId: null },
      include: [{ model: Profile, as: "profile" }]
    })
      .then(user => {
        if (!user) {
          return false;
        }
        results.user = user;
        return user.authenticate(password);
      })
      .then(authenticated => {
        if (authenticated === true) {
          let credentials: any = this.getCredentials(results.user);
          return Controller.ok(res, credentials);
        } else {
          return Controller.unauthorized(res);
        }
      })
      .catch(err => {
        log.error(err);
        return Controller.badRequest(res);
      });
  }

  logout(req: Request, res: Response) {
    let token: string = req.session.jwtstring;
    let decodedjwt: any = req.session.jwt;
    if (_.isUndefined(token)) return Controller.unauthorized(res);
    if (_.isUndefined(decodedjwt)) return Controller.unauthorized(res);
    // Put token in blacklist
    JWTBlacklist.create({
      token: token,
      expires: decodedjwt.exp
    })
      .then(result => {
        Controller.ok(res);
        return null;
      })
      .catch(err => {
        return Controller.serverError(res, err);
      });
  }

  refreshToken(req: Request, res: Response) {
    // Refresh token has been previously authenticated in validateJwt as refresh token
    let refreshToken: string = req.session.jwtstring;
    let decodedjwt: any = req.session.jwt;
    let reqUser: any = req.session.user;
    // Put refresh token in blacklist
    JWTBlacklist.create({
      token: refreshToken,
      expires: decodedjwt.exp
    })
      .then(result => {
        return User.findOne({ where: { id: reqUser.id } });
      })
      .then((user: any) => {
        if (!user) {
          return Controller.unauthorized(res);
        }
        // Create new token and refresh token and send
        let credentials: any = this.getCredentials(user);
        return Controller.ok(res, credentials);
      })
      .catch(err => {
        return Controller.serverError(res, err);
      });
  }

  register(req: Request, res: Response) {
    let newUser = {
      email: req.body.email,
      password: req.body.password
    };

    // Optional extra params:
    let locale: string | undefined = req.body.locale;
    let timezone: string | undefined = req.body.timezone;

    // Validate
    if (newUser.email == null || newUser.password == null)
      return Controller.badRequest(res);
    // Email and password length should be validated on user create TODO test

    let user: any;
    User.create(newUser)
      .then(result => {
        // We need to do another query because before the profile wasn't ready
        return User.findOne({
          where: { id: result.id },
          include: [{ model: Profile, as: "profile" }]
        })
          .then(result => {
            user = result;
            // Set extra params:
            if (locale != null) user.profile.locale = locale;
            if (timezone != null) user.profile.time_zone = timezone;
            return user.profile.save();
          })
          .then(result => {
            let credentials: any = this.getCredentials(user);
            return Controller.ok(res, credentials);
          });
      })
      .catch(err => {
        if (
          err.errors != null &&
          err.errors.length &&
          err.errors[0].type === "unique violation" &&
          err.errors[0].path === "email"
        ) {
          return Controller.forbidden(res, "email in use");
        } else if (err) return Controller.serverError(res, err);
      });
  }

  /*
    This can serve two different use cases:
      1. Request sending of recovery token via email (body: { email: '...' })
      2. Set new password (body: { token: 'mytoken', password: 'newpassword' })
  */
  resetPost(req: Request, res: Response) {
    // Validate if case 2
    let token: string = req.body.token;
    let password: string = req.body.password;

    if (!_.isUndefined(token) && !_.isUndefined(password)) {
      return this.handleResetChPass(token, password)
        .then(credentials => Controller.ok(res, credentials))
        .catch(err => {
          log.error(err);
          if (err.error == "badRequest")
            return Controller.badRequest(res, err.msg);
          if (err.error == "notFound") return Controller.notFound(res, err.msg);
          if (err.error == "serverError")
            return Controller.serverError(res, err.msg);
          return Controller.serverError(res);
        });
    }

    // Validate case 1
    let email: string = req.body.email;
    if (!_.isUndefined(email)) {
      return this.handleResetEmail(email)
        .then(info => {
          log.info(info);
          Controller.ok(res);
        })
        .catch(err => {
          log.error(err);
          if (err.error == "badRequest")
            return Controller.badRequest(res, err.msg);
          if (err.error == "notFound") return Controller.notFound(res, err.msg);
          if (err.error == "serverError")
            return Controller.serverError(res, err.msg);
          return Controller.serverError(res);
        });
    }

    return Controller.badRequest(res);
  }

  resetGet(req: Request, res: Response) {
    let token: any = req.query.token;
    if (_.isUndefined(token)) return Controller.unauthorized(res);
    // Decode token
    this.validateJWT(token, "reset")
      .then(decodedjwt => {
        if (decodedjwt)
          res.redirect(`${config.urls.base}/recovery/#/reset?token=${token}`);
        else Controller.unauthorized(res);
        return null;
      })
      .catch(err => {
        return Controller.unauthorized(res, err);
      });
  }

  changePassword(req: Request, res: Response) {
    let email = req.body.email;
    let oldPass = req.body.oldPass;
    let newPass = req.body.newPass;
    // Validate
    if (email == null || oldPass == null || newPass == null)
      return Controller.badRequest(res);
    if (email.length === 0 || oldPass.length === 0 || newPass.length === 0)
      return Controller.badRequest(res);
    // IMPORTANT: Check if email is the same as the one in the token
    if (email != req.session.jwt.email) return Controller.unauthorized(res);

    let results = {
      user: null
    };

    User.findOne<User>({
      where: { id: req.session.jwt.id },
      include: [{ model: Profile, as: "profile" }]
    })
      .then((user: User) => {
        if (!user) {
          return false;
        }
        results.user = user;
        return user.authenticate(oldPass);
      })
      .then(authenticated => {
        if (authenticated === true) {
          results.user.password = newPass;
          return results.user.save();
        } else {
          return Controller.unauthorized(res);
        }
      })
      .then(result => {
        if (!result) return Controller.serverError(res);
        let credentials: any = this.getCredentials(results.user);
        return Controller.ok(res, credentials);
      })
      .catch(err => {
        log.error(err);
        return Controller.badRequest(res);
      });
  }

  async googleLogin(req: Request, res: Response) {
    const idToken = req.body.idToken;
    if (idToken == null) return Controller.badRequest(res);
    try {
      const ticket = await gAuthClient.verifyIdToken({
        idToken,
        audience: config.auth.google.clientId
      });
      const payload = ticket.getPayload();
      const userId = payload["sub"];
      const domain = payload["hd"] || payload["email"].split("@")[1]; //Allow gmail domains, temporal solution
      const email = payload["email"];
      const name = payload["name"];
      const picture = payload["picture"];

      if (
        domain == null ||
        config.auth.google.allowedDomains.indexOf(domain) < 0
      ) {
        return Controller.unauthorized(res, "Unauthorized domain");
      }

      // Check if user exists
      let user: User = await User.findOne({
        where: { googleId: userId, email },
        include: [{ model: Profile, as: "profile" }]
      });
      if (user == null) {
        // Create new user
        user = await User.create({
          email,
          name,
          picture,
          googleId: userId,
          password: "DUMMYPASS" // Won't be used, validated in login method
        });
        // We need to do another query because before the profile wasn't ready
        user = await User.findOne({
          where: { id: user.id },
          include: [{ model: Profile, as: "profile" }]
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
  }
}

const controller = new AuthController();
export default controller;
