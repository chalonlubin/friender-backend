"use strict";

/** Routes for authentication. */
const jsonschema = require("jsonschema");
// TODO: how to save photos without creating an uploads folder
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const User = require("../models/user");
const express = require("express");
const router = new express.Router();
const { createToken } = require("../helpers/tokens");
// const userAuthSchema = require("../schemas/userAuth.json");
// const userRegisterSchema = require("../schemas/userRegister.json");
const { BadRequestError } = require("../expressError");
const { uploadFile } = require("../s3");



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
 * user must include { username, password, image, location, radius }
 *
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: none
 */

// TODO: on the front end, make sure form has correct attrib for multer
// TODO: This is creating an uploads folder, how to stop?
router.post(
  "/register",
  upload.single("image"),
  async function (req, res, next) {
    const file = req.file;

    const result = await uploadFile(file);
    const filePath = result.Location;
    console.log('filePath',filePath);

    const user = { ...req.body, image: filePath };

    // const validator = jsonschema.validate(
    //   req.body,
    //   userRegisterSchema,
    //   {required: true}
    // );
    // if (!validator.valid) {
    //   const errs = validator.errors.map(e => e.stack);
    //   throw new BadRequestError(errs);
    // }

    const newUser = await User.register({ ...user });
    const token = createToken(newUser);
    return res.status(201).json({ token });
  }
);

module.exports = router;
