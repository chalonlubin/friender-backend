"use strict";

/** Shared config for Friender */

require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY || "secret";

const DB_URI =
  process.env.NODE_ENV === "test"
    ? "postgresql:///friender_test"
    : "postgresql:///friender";


const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;

module.exports = {
  DB_URI,
  SECRET_KEY,
  BCRYPT_WORK_FACTOR,
};
