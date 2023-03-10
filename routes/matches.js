"use strict";

/** Routes for matches. */

const express = require("express");
const { ensureCorrectUser } = require("../middleware/auth");
const Match = require("../models/match");

const router = express.Router();

/** POST :/username
 *
 * updates match status between liker and likee
 *
 * Returns {liker, likee, matchStatus (bool)}
 *
 * Authorization required: same user-as-:username
 */
router.post("/:username", ensureCorrectUser, async function (req, res, next) {
  try {
    const liker = req.params.username;
    const { likee, match } = req.body;

    const matchStatus = await Match.updateMatch(liker, likee, match);

    return res.json({ matchStatus });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
