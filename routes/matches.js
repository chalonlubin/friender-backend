"use strict";

/** Routes for matches. */

// const jsonschema = require("jsonschema");
// const userNewSchema = require("../schemas/userNew.json");
// const userUpdateSchema = require("../schemas/userUpdate.json");

const express = require("express");
const { ensureCorrectUser } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const Match = require("../models/match");
const { createToken } = require("../helpers/tokens");

const router = express.Router();

/**  */
router.post("/:username", ensureCorrectUser, async function (req, res, next) {
  const liker = req.params.username
  const { likee, match } = req.body;
  console.log("matches", match)

  const matchStatus = await Match.updateMatch(liker, likee, match)

  return res.json({ matchStatus })
})

module.exports = router;
