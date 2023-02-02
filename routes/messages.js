"use strict";

const express = require("express");
const jsonschema = require("jsonschema");

const Message = require("../models/message");
const User = require("../models/user");

const { ensureCorrectUser } = require("../middleware/auth");
const { NotFoundError, BadRequestError } = require("../expressError");

const messageNewSchema = require("../schemas/messageNew.json");

/** Message routes for match dm's. */

const router = express.Router();

/** POST /:username
 *
 *  - creates a new message
 *  - body: {toUsername, body}
 *
 *  Authorization required: same user-as-:username
 *
 *  Returns {id, fromUsername, toUsername, body, sentAt, readAt}
 **/
router.post("/:username", ensureCorrectUser, async function (req, res, next) {
  const fromUsername = req.params.username;
  const { toUsername, body } = req.body;

  // make sure users are a match.
  const matches = await User.getMatches(fromUsername);
  const matchStatus = matches.some((match) => match.username === toUsername);
  if (matchStatus === false)
    throw new NotFoundError("You can only message matches.");

  const validator = jsonschema.validate(
    { toUsername, body },
    messageNewSchema,
    {
      required: true,
    }
  );
  if (!validator.valid) {
    const errs = validator.errors.map((e) => e.stack);
    throw new BadRequestError(errs);
  }

  try {
    const newMessage = await Message.create(fromUsername, toUsername, body);
    return res.json({ newMessage });
  } catch (err) {
    return next(err);
  }
});

/** PATCH /:id
 *
 * - updates the read_at property to the current timestamp
 * - query strings: id
 *
 *  Authorization required: same user-as-:username
 *
 *  Returns {id, readAt}
 */
router.patch("/:id", async function (req, res, next) {
  try {
    const { id } = req.params;
    const message = await Message.markRead(id);
    return res.json({ message });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
