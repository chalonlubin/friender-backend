"use strict";



/** Routes for authentication. */
const express = require("express");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage});
const { uploadFile } = require("../s3");

const { createToken } = require("../helpers/tokens");
const { BadRequestError } = require("../expressError");

const User = require("../models/User");
const jsonschema = require("jsonschema");
const userNew = require("../schemas/userNew.json");
const userAuth = require("../schemas/userAuth.json");

const router = express.Router();

/** POST /auth/token:  { username, password } => { token }
 *
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: none
 */

router.post("/token", async function (req, res, next) {
  try {
    if (req.body === undefined) {
      throw new BadRequestError();
    }

    const { username, password } = req.body;

    const validator = jsonschema.validate({ username, password }, userAuth, {
      required: true,
    });

    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const user = await User.authenticate(username, password);

    if (user) {
      const token = createToken(user);
      User.updateLoginTimestamp(username);
      return res.json({ token });
    } else {
      throw new UnauthorizedError("Invalid username/password");
    }
  } catch (err) {
    return next(err);
  }
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
router.post(
  "/register",
  upload.single("image"),
  async function (req, res, next) {
    try {
      req.body.location = +req.body.location;
      req.body.radius = +req.body.radius;

      if (!req.file) throw new BadRequestError("Image required.")

      console.log("result", req.file)
      const file = req.file;
      const result = await uploadFile(file);
      const filePath = result.Location;
      const user = { ...req.body, image: filePath };

      const validator = jsonschema.validate(user, userNew, {
        required: true,
      });

      if (!validator.valid) {
        const errs = validator.errors.map((e) => e.stack);
        throw new BadRequestError(errs);
      }

      const newUser = await User.register({ ...user });
      const token = createToken(newUser);

      return res.status(201).json({ token });
    } catch (err){
      next(err)
    }
  }
);

module.exports = router;
