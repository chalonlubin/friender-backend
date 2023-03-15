"use strict";

/** Shared config for Friender */

require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY || "secret";

const PORT = process.env.PORT || 3001;

function getDatabaseUri() {
  return (process.env.NODE_ENV === "test")
    ? "postgresql:///friender_test"
    : process.env.DATABASE_URL || "postgresql:///friender";
}

const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;

console.log("Jobly Config:".green);
console.log("SECRET_KEY:".yellow, SECRET_KEY);
console.log("PORT:".yellow, PORT.toString());
console.log("BCRYPT_WORK_FACTOR".yellow, BCRYPT_WORK_FACTOR);
console.log("Database:".yellow, getDatabaseUri());
console.log("---");

module.exports = {
  PORT,
  SECRET_KEY,
  BCRYPT_WORK_FACTOR,
  getDatabaseUri,
};
