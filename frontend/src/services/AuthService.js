import { reject } from "bluebird";
/**
 * @typedef {Object} Profile
 * @property {number} id - profile id
 * @property {string} locale - profile locale
 * @property {string} time_zone - profile time_zone
 * @property {string} createdAt - profile creation date
 * @property {string} updatedAt - profile updated date
 * @property {number} userId - profile user id
 */

/**
 *@typedef {Object} RefreshToken
 *@property {number} expires - token expiration time
 *@property {number} expiresIn - seconds to expire
 */

/**
 * @typedef {Object} Credentials
 * @property {number} expires - expiration time
 * @property {Profile} profile - user profile
 * @property {RefreshToken} refresh_token - refresh token information
 * @property {string} token - access token
 * @property {User} user - user info
 */

/**
 * @version 1.0
 * @exports AuthService
 * @namespace AuthService
 * @property {string} authUri - room uri
 */

const AuthService = authUri => {
  /**
   * Return credentials
   * @param {string} idToken - id token
   * @returns {Credentials}
   */
  const onLogin = idToken => {
    return fetch(authUri, {
      method: "POST",
      body: JSON.stringify({
        idToken
      }),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => {
      switch (res.status) {
        case 200:
          return res.json();
        case 401:
          return reject(new Error("ERROR 401: Unauthorized Account"));
        case 403:
          return reject(new Error("ERROR 403"));
        default:
          return reject(new Error("Unknow error"));
      }
    });
  };

  return { onLogin };
};

export default AuthService;
