"use strict";

/** Routes for users. */

const express = require("express");
const User = require("../models/user");
const jsonschema = require("jsonschema");
const userUpdateSchema = require("../schemas/userUpdate.json");
const { ensureCorrectUser } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({storage});
const { uploadFile } = require("../s3");

const router = express.Router();

/** GET /:username/potentials
 *
 *  - gets all users that are not the current user and have not
 *    matched with curr user
 *
 *  - query strings: username, location, radius
 *
 * Returns [{username, hobbies, interests, location, radius, image,
 *  joinAt, lastLoginAt}, ...]
 *
 * Authorization required: same user-as-:username
 **/
router.get(
  "/:username/potentials",
  ensureCorrectUser,
  async function (req, res, next) {
    try {
      const { username } = req.params;
      const user = await User.get(username);
      const users = await User.getAll(user);
      return res.json({ users });
    } catch (err) {
      return next(err);
    }
  }
);

/** GET :/username
 *
 * - gets a single users data
 *
 * Returns {username, hobbies, interests, location, radius,
 *  image, joinAt, lastLoginAt}
 *
 * Authorization required: same user-as-:username
 **/
router.get("/:username", ensureCorrectUser, async function (req, res, next) {
  try {
    const user = await User.get(req.params.username);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});

/** PATCH /:username
 *
 * Data can include:
 *   { hobbies, interests, location, radius, image }
 *
 * Returns { username, hobbies, interests, location, radius, image}
 *
 * Authorization required: same-user-as-:username
 **/

router.patch(
  "/:username",
  ensureCorrectUser,
  upload.single("image"),
  async function (req, res, next) {
    if (req.body?.location) req.body.location = +req.body.location;
    if (req.body?.radius) req.body.radius = +req.body.radius;
    let userUpdate = req.body;

    if (req.file) {
      const file = req.file;
      console.log('req.file!',req.file);
      const result = await uploadFile(file);
      const filePath = result.Location;
      userUpdate = { ...req.body, image: filePath };
    }
    try {
      const validator = jsonschema.validate(userUpdate, userUpdateSchema, {
        required: true,
      });
      if (!validator.valid) {
        const errs = validator.errors.map((e) => e.stack);
        throw new BadRequestError(errs);
      }
      const user = await User.update(req.params.username, userUpdate);
      return res.json({ user });
    } catch (err) {
      return next(err);
    }
  }
);

/** DELETE /:username
 *
 * Returns {deleted: username}
 *
 * Authorization required: same-user-as-:username
 **/
router.delete("/:username", ensureCorrectUser, async function (req, res, next) {
  try {
    await User.remove(req.params.username);
    return res.json({ deleted: req.params.username });
  } catch (err) {
    return next(err);
  }
});

/** GET /:username/matches
 *
 *  - gets all users the curr user has matched with (swiped right)
 *
 * Returns [{username, hobbies, interests, location, radius,
 *  image, lastLoginAt},...]
 *
 * Authorization required: same user-as-:username
 **/
router.get(
  "/:username/matches",
  ensureCorrectUser,
  async function (req, res, next) {
    try {
      const matches = await User.getMatches(req.params.username);
      return res.json({ matches });
    } catch (err) {
      return next(err);
    }
  }
);

/** GET :/username/messages/:recipient
 *
 *  - gets all messages sent and received from user and recipient.
 *
 *  Returns { messages }
 *
 * Authorization required: same user-as-:username
 **/
router.get(
  "/:username/messages/:recipient",
  ensureCorrectUser,
  async function (req, res, next) {
    try {
      const { username, recipient } = req.params;
      const messages = await User.getMessages(username, recipient);
      return res.json({ messages });
    } catch (err) {
      return next(err);
    }
  }
);

module.exports = router;
