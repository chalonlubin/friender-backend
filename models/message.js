"use strict";

/** Message class for Friender */

const { NotFoundError } = require("../expressError");
const db = require("../db");

/** Message on the site. */

class Message {
  /** Register new message -- returns
   *    {id, from_username, to_username, body, sent_at, read_at}
   */

  static async create( from_username, to_username, body ) {
    const result = await db.query(
      `INSERT INTO messages (from_username,
                                 to_username,
                                 body,
                                 sent_at,
                                 read_at)
             VALUES
               ($1, $2, $3, current_timestamp, current_timestamp)
             RETURNING id, from_username AS "fromUsername",
             to_username as "toUsername",
             body,
             sent_at as "sentAt",
             read_at as "readAt"`,
      [from_username, to_username, body]
    );

    return result.rows[0];
  }

  /** Update read_at for message
   *
   * updates the read_at property to the current timestamp
   *
   * returns {id, read_at}
   *
   **/

  static async markRead(id) {
    const result = await db.query(
      `UPDATE messages
           SET read_at = current_timestamp
             WHERE id = $1
             RETURNING id, read_at`,
      [id]
    );
    const message = result.rows[0];

    if (!message) throw new NotFoundError(`No such message: ${id}`);

    return message;
  }
}

module.exports = Message;
