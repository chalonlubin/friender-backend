"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const { BCRYPT_WORK_FACTOR } = require("../config");
const { NotFoundError, BadRequestError, UnauthorizedError } = require("../expressError");

/** User of the site. */

class User {

  /** Given new user data, creates new user in the db with hashed pw
   * Returns new user
   *
   *  - { username, password, hobbies, interest, location, [images], radius } ->
   *    { username, hobbies, interest, location, [images],
   *        radius, join_at, last_login_at }
   */
  static async register({ username, password, hobbies, interest, location, images, radius }) {
    const duplicateCheck = await db.query(
      `SELECT username
       FROM users
       WHERE username = $1`,
    [username],
    );

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate username: ${username}`);
    }
    // TODO: insert images into AWS, retrieve urls and return
    const hashedPw = await bcrypt.hash(password, BCRYPT_WORK_FACTOR)

    const results = await db.query(
      `INSERT INTO users (
              username,
              password,
              hobbies,
              interest,
              images,
              location,
              radius,
              join_at,
              last_login_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, current_timestamp, current_timestamp)
        RETURNING username,
              hobbies,
              interest,
              images,
              location,
              radius,
              join_at,
              last_login_at
      )`, [username, hashedPw, hobbies, interest, images, location, radius]
    );

    return results.rows[0];
  }

  /** Given login data, authenticate and return user without pw
   *  - throw error if no user
   *
   *  - (username, password) ->
   *    { username, hobbies, interest, location, [images],
   *        radius, join_at, last_login_at }
   */
  static async authenticate( username, password ) {
    const results = await db.query(
      `SELECT username,
              password,
              hobbies,
              interest,
              images,
              location,
              radius,
              join_at,
              last_login_at
        FROM users
        WHERE username = $1`
      , [username]
    )

    const user = results.rows[0];

    if (user) {
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid === true) {
        // don't return pw
        delete user.password;
        return user;
      }
    }

    throw new UnauthorizedError("Invalid username/password");
  }

  // TODO: how to find users within radius of a location

      // npm install this: https://www.npmjs.com/package/zipcodes

  // TODO: If we cant get past the zipcode issue, use states instead
  /** Get all users that are within radius of currUser's location */
  static async getAll(username, location, radius) {
    // return array of user objects,

    const results = await db.query(
      `SELECT username,
              interest,
              hobbies,
              images,
              location,
              radius,
              join_at,
              last_login_at
        FROM users
        WHERE username NOT IN (
          SELECT likee FROM matches WHERE liker = $1
        ) AND username != $1
        `, [username]
    )
    // user helper function to filter users for users within radius of location

  }
}
