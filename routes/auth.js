"use strict";

/** Routes for authentication. */

const jsonschema = require("jsonschema");

const User = require("../models/user");
const express = require("express");
const router = new express.Router();
const { createToken } = require("../helpers/tokens");
// const userAuthSchema = require("../schemas/userAuth.json");
// const userRegisterSchema = require("../schemas/userRegister.json");
const { BadRequestError } = require("../expressError");

/** POST /auth/token:  { username, password } => { token }
 *
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: none
 */

router.post("/token", async function (req, res, next) {
  // const validator = jsonschema.validate(
  //   req.body,
  //   userAuthSchema,
  //   {required: true}
  // );
  // if (!validator.valid) {
  //   const errs = validator.errors.map(e => e.stack);
  //   throw new BadRequestError(errs);
  // }

  const { username, password } = req.body;
  const user = await User.authenticate(username, password);
  const token = createToken(user);
  return res.json({ token });
});


/** POST /auth/register:   { user } => { token }
 *
 * user must include { username, password, images, location, radius }
 *
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: none
 */

// TODO: on the front end, make sure form has correct attrib for multer
router.post("/register", upload.single('image'), async function (req, res, next) {
  // req.file is the `image` file
  // req.body will hold the text fields, if there were any
  const image = req.image;
  console.log(image);
  const { username, password, interests, hobbies, location, radius} = req.body

  // const validator = jsonschema.validate(
  //   req.body,
  //   userRegisterSchema,
  //   {required: true}
  // );
  // if (!validator.valid) {
  //   const errs = validator.errors.map(e => e.stack);
  //   throw new BadRequestError(errs);
  // }

  const newUser = await User.register({ ...req.body});
  const token = createToken(newUser);
  return res.status(201).json({ token });
});


module.exports = router;
