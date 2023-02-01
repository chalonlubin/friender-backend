"use strict";

/** Match class for Friender */

class Match {

  /** updates match table with
   *
   * returns {liker, likee, matched}
   *
   */
  static async updateMatch(likerUsername, likeeUsername, match) {
    const result = await db.query(
      `INSERT INTO matches (liker, likee, matched)
      VALUES ($1, $2', $3)
      RETURNING liker, likee, matched as MatchStatus;
      `,
      [likerUsername, likeeUsername, match]
    );
    const match = result.rows[0];
    return match;
  }

  /** Find matches for a user by username
   *
   * returns [likee, matched}, ...]
   *
   * */

  static async findMatches(username) {
    const result = await db.query(
      `SELECT likee, matched
      FROM matches
      WHERE liker IN (
        SELECT likee
        FROM matches
        WHERE liker = likee AND matched = 'true'
      ) AND matched = 'true'
      AND liker = $1;
      `,
      [username]
    );
    const matches = result.rows;
    return matches;
  }
}
