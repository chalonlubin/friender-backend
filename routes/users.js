"use strict";

/** Routes for users. */

// const jsonschema = require("jsonschema");

const express = require("express");
const { ensureCorrectUser } = require("../middleware/auth");
// const { BadRequestError } = require("../expressError");
const User = require("../models/user");
const { createToken } = require("../helpers/tokens");
// const userNewSchema = require("../schemas/userNew.json");
// const userUpdateSchema = require("../schemas/userUpdate.json");

const router = express.Router();


/** TEST ROUTE */
router.get("/", async function (req, res, next) {
  try {
    const results = await db.query(
      `SELECT *
        FROM users`);
    const user = results.rows;

    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});

/** GET users/[username] => { user }
 *
 * Returns {username, hobbies, interests, location, radius, images}
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

//FIXME: This route probably should go in matches
/** GET matches/users/ => [{...match data},....]
 *
 *
 * Returns [{username, hobbies, interests, location, radius, images},....]
 *
 * Authorization required: same user-as-:username
 **/

router.get(
  "matches/:username",
  ensureCorrectUser,
  async function (req, res, next) {
    try {
      const user = await User.get(req.params.username);
      return res.json({ user });
    } catch (err) {
      return next(err);
    }
  }
);

/** PATCH users/[username] { user } => { user }
 *
 * Data can include:
 *   { hobbies, interests, location, radius, images }
 *
 * Returns { username, hobbies, interests, location, radius, images}
 *
 * Authorization required: same-user-as-:username
 **/

// router.patch("users/:username", ensureCorrectUser, async function (req, res, next) {
//   try {
//     const validator = jsonschema.validate(
//       req.body,
//       userUpdateSchema,
//       {required: true}
//     );
//     if (!validator.valid) {
//       const errs = validator.errors.map(e => e.stack);
//       throw new BadRequestError(errs);
//     }

//     const user = await User.update(req.params.username, req.body);
//     return res.json({ user });
//   } catch (err) {
//     return next(err);
//   }
// });

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

module.exports = router;
