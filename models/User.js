"use strict";

/** User class for friender. */

const db = require("../db");
const bcrypt = require("bcrypt");
const { BCRYPT_WORK_FACTOR } = require("../config");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

/** User of the site. */

class User {
  /** Given new user data, creates new user in the db with hashed pw
   * Returns new user
   *
   *  - { username, password, hobbies, interest, location, [images], radius } ->
   *    { username, hobbies, interest, location, [images],
   *        radius, join_at, last_login_at }
   */
  static async register({
    username,
    password,
    hobbies,
    interest,
    location,
    images,
    radius,
  }) {
    const duplicateCheck = await db.query(
      `SELECT username
       FROM users
       WHERE username = $1`,
      [username]
    );

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate username: ${username}`);
    }
    // TODO: insert images into AWS, retrieve urls and return
    const hashedPw = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

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
              join_at AS "joinAt",
              last_login_at AS "lastLoginAt"`,
      [username, hashedPw, hobbies, interest, images, location, radius]
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
  static async authenticate(username, password) {
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
        WHERE username = $1`,
      [username]
    );

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
              join_at AS "joinAt",
              last_login_at AS "lastLoginAt"
        FROM users
        WHERE username NOT IN (
          SELECT likee FROM matches WHERE liker = $1
        ) AND username != $1
        ORDER BY username`,
      [username]
    );
    // user helper function to filter users for users within radius of location
    return results.rows;
  }

  /** Given a username, return data about user.
   *
   * Returns { username, hobbies, interest, location, [images],
   *       radius, join_at, last_login_at }
   *
   * Throws NotFoundError if user not found.
   */
  static async get(username) {
    const userRes = await db.query(
      `SELECT username,
      hobbies,
      interest,
      images,
      location,
      radius,
      join_at AS "joinAt",
      last_login_at AS "lastLoginAt"
           FROM users
           WHERE username = $1`,
      [username]
    );

    const user = userRes.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);

    return user;
  }

  /** Return messages from this user.
   *
   * [{id, to_user, body, sent_at, read_at}]
   *
   * where to_user is
   *   {username}
   */

  static async messagesFrom(username) {
    const result = await db.query(
      `SELECT m.id,
                  m.to_username,
                  m.body,
                  m.sent_at,
                  m.read_at
             FROM messages AS m
                    JOIN users AS u ON m.to_username = u.username
             WHERE from_username = $1`,
      [username]
    );

    return result.rows.map((m) => ({
      id: m.id,
      to_user: {
        username: m.to_username,
        first_name: m.first_name,
        last_name: m.last_name,
        phone: m.phone,
      },
      body: m.body,
      sent_at: m.sent_at,
      read_at: m.read_at,
    }));
  }

  /** Return messages to this user.
   *
   * [{id, from_user, body, sent_at, read_at}]
   *
   * where from_user is
   *   {id}
   */

  static async messagesTo(username) {
    const result = await db.query(
      `SELECT m.id,
                  m.from_username,
                  m.body,
                  m.sent_at,
                  m.read_at
             FROM messages AS m
                    JOIN users AS u ON m.from_username = u.username
             WHERE to_username = $1`,
      [username]
    );

    return result.rows.map((m) => ({
      id: m.id,
      from_user: {
        username: m.from_username,
        first_name: m.first_name,
        last_name: m.last_name,
        phone: m.phone,
      },
      body: m.body,
      sent_at: m.sent_at,
      read_at: m.read_at,
    }));
  }

  /** Update user data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Data can include:
   *   {password, hobbies, interests, images, location, radius }
   *
   * Returns { username, hobbies, interests, images, location, radius }
   *
   * Throws NotFoundError if not found.
   *
   */

  //TODO:  needs work
  static async update(username, data) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
    }
  }

  /** Delete given user from database; returns undefined.
   *
   */
  static async remove(username) {
    let result = await db.query(
      `DELETE
           FROM users
           WHERE username = $1
           RETURNING username`,
      [username]
    );
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);
  }
}

module.exports = User;
