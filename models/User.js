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
const { sqlForPartialUpdate } = require("../helpers/sqlHelper");
const { inRadius } = require("../helpers/radius");

/** User of the site. */

class User {
  /** Given new user data, creates new user in the db with hashed pw
   * Returns new user
   *
   *  - { username, password, hobbies, interests, location, [image], radius } ->
   *    { username, hobbies, interests, location, [image],
   *        radius, join_at, last_login_at }
   */
  static async register({
    username,
    password,
    hobbies,
    interests,
    location,
    image,
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
    const hashedPw = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const results = await db.query(
      `INSERT INTO users (
              username,
              password,
              hobbies,
              interests,
              image,
              location,
              radius,
              join_at,
              last_login_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, current_timestamp, current_timestamp)
        RETURNING username,
              hobbies,
              interests,
              image,
              location,
              radius,
              join_at AS "joinAt",
              last_login_at AS "lastLoginAt"`,
      [username, hashedPw, hobbies, interests, image, location, radius]
    );

    return results.rows[0];
  }

  /** Given login data, authenticate and return user without pw
   *  - throw error if no user
   *
   *  - (username, password) ->
   *    { username, hobbies, interests, location, [image],
   *        radius, join_at, last_login_at }
   */
  static async authenticate(username, password) {
    const results = await db.query(
      `SELECT username,
              password,
              hobbies,
              interests,
              image,
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

  /** Get all users that are within radius preference of curUser's location
   *
   * - Accepts user: { username, location, radius }
   *
   * - Returns array of users:
   *   [{ username, hobbies, interests, location, image,
   *       radius, join_at, last_login_at }...]
   *
   */
  static async getAll({ username, location, radius }) {
    // return array of user objects,

    const results = await db.query(
      `SELECT username,
              interests,
              hobbies,
              image,
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

    const curUser = { username, location, radius };

    const eligibleUsers = results.rows.filter((potential) => {
      if (inRadius(curUser, potential)) return potential;
    });

    return eligibleUsers;
  }

  /** Given a username, return data about user.
   *
   * Returns { username, hobbies, interests, location, image,
   *       radius, join_at, last_login_at }
   *
   * Throws NotFoundError if user not found.
   */
  static async get(username) {
    const userRes = await db.query(
      `SELECT username,
              hobbies,
              interests,
              image,
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

  /** Given a username, return data about user.
   *
   * Returns { username, hobbies, interests, location, image,
   *       radius, join_at, last_login_at }
   *
   * Throws NotFoundError if user not found.
   */
  static async getMatches(username) {
    const matchesRes = await db.query(
      `SELECT username,
              hobbies,
              interests,
              image,
              location,
              radius,
              last_login_at AS "lastLoginAt"
          FROM users AS u
          JOIN matches AS a
            ON a.likee = u.username
          JOIN matches as b
            ON b.liker = u.username
          WHERE (a.liker = $1 AND a.likee = u.username AND a.matched = 't')
            AND (b.liker = u.username AND b.likee = $1 AND b.matched = 't')`,
      [username]
    );

    const matches = matchesRes.rows;

    return matches;
  }

  /** Get messages from user to user AND messages to user1 from user2
   *
   * Accepts liker, likee
   *
   * Returns array of messages:
   *  [{ fromUsername, toUsername, body, sentAt, readAt }...]
   *  sorted by sentAt ascending.
   */
  static async getMessages(liker, likee) {
    const messagesRes = await db.query(
      `SELECT from_username AS "fromUsername",
              to_username AS "toUsername",
              body,
              sent_at AS "sentAt",
              read_at AS "readAt"
          FROM messages
          WHERE (to_username = $1 AND from_username = $2)
          OR (to_username = $2 AND from_username = $1)
          ORDER BY sent_at ASC`,
      [likee, liker]
    );

    const messages = messagesRes.rows;

    return messages;
  }

  /** Update user data with `data`.
   *
   * Data can include:
   *   { interests, hobbies, location, image, radius }
   *
   * Returns { username, interests, hobbies, location, image, radius }
   *
   * Throws NotFoundError if not found.
   *
   */
  static async update(username, data) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
    }

    const { setCols, values } = sqlForPartialUpdate(data);
    const usernameVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE users
                        SET ${setCols}
                        WHERE username = ${usernameVarIdx}
                        RETURNING username,
                                  interests,
                                  hobbies,
                                  image,
                                  location,
                                  radius`;
    const result = await db.query(querySql, [...values, username]);
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);

    return user;
  }

  /** Update last_login_at for user */
  static async updateLoginTimestamp(username) {
    const result = await db.query(
      `UPDATE users
         SET last_login_at = current_timestamp
           WHERE username = $1
           RETURNING username`,
      [username]
    );
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No such user: ${username}`);
  }

  /** Delete given user from database; returns undefined.
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

    if (user.length === 0) throw new NotFoundError(`No user: ${username}`);

    return { deleted: username };
  }
}

module.exports = User;
