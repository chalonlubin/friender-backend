"use strict";

const db = require("../db");



/** Match class for Friender */

class Match {

  /** Updates match table with two users that have
   *  liked/not liked the other user
   *
   * returns {liker, likee, matchStatus (bool)}
   *
   */
  static async updateMatch(likerUsername, likeeUsername, matchStatus) {
    const result = await db.query(
      `INSERT INTO matches (liker, likee, matched)
              VALUES ($1, $2, $3)
          RETURNING liker, likee, matched AS "matchStatus"
      `,
      [likerUsername, likeeUsername, matchStatus]
    );
    const match = result.rows[0];
    return match;
  }
}

module.exports = Match;
