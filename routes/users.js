"use strict";

/** Routes for users. */

// const jsonschema = require("jsonschema");

const express = require("express");
const { ensureCorrectUser } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const User = require("../models/user");
// const userNewSchema = require("../schemas/userNew.json");
// const userUpdateSchema = require("../schemas/userUpdate.json");

const router = express.Router();

/** GET / => [{user}, {user}, ...]
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
router.get("/:username/potentials", ensureCorrectUser, async function (req, res, next) {
  try {
    const { username } = req.params
    const { location, radius } = req.query
    const users = await User.getAll(username, location, radius)
    return res.json({users})

  } catch (err) {
    return next(err);
  }
});

/** GET users/[username] => { user }
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

/** PATCH users/[username] { user } => { user }
 *
 * Data can include:
 *   { hobbies, interestss, location, radius, image }
 *
 * Returns { username, hobbies, interests, location, radius, image}
 *
 * Authorization required: same-user-as-:username
 **/

router.patch("/:username", ensureCorrectUser, async function (req, res, next) {
  try {
    // const validator = jsonschema.validate(
    //   req.body,
    //   userUpdateSchema,
    //   {required: true}
    // );
    // if (!validator.valid) {
    //   const errs = validator.errors.map(e => e.stack);
    //   throw new BadRequestError(errs);
    // }
    const user = await User.update(req.params.username, req.body);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});

/** DELETE users/[username]  =>  { deleted: username }
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


//FIXME: This route probably should go in matches
/** GET users/:username/matches => [{user},....]
 *
 *  - gets all users the curr user has matched with (swiped right)
 *
 * Returns [{username, hobbies, interests, location, radius,
 *  image, lastLoginAt},...]
 *
 * Authorization required: same user-as-:username
 **/

//TODO: Handle empty matches in React
router.get("/:username/matches", ensureCorrectUser, async function (req, res, next) {
  try {
    const matches = await User.getMatches(req.params.username);
    return res.json({ matches });

  } catch (err) {
    return next(err);
  }
}
);

router.get("/:username/messages/:recipient", ensureCorrectUser, async function (req, res, next) {
  try {
    const { username, recipient } = req.params
    const messages = await User.getMessages(username, recipient)
    return res.json({ messages })
  } catch (err) {
    return next(err);
  }
})

module.exports = router;
