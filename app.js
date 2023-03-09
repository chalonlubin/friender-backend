"use strict";

/** Express app for Friender. */

const express = require("express");
const cors = require("cors");

const { NotFoundError } = require("./expressError");

const { authenticateJWT } = require("./middleware/auth");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const messageRoutes = require("./routes/messages");
const matchesRoutes = require("./routes/matches");

const app = express();

// allow connections to all routes from any browser
app.use(cors({
  origin: 'https://friender-adventure.surge.sh'
}));

// allow both form-encoded and json body parsing
app.use(express.json());
app.use(express.urlencoded());


// get auth token for all routes
app.use(authenticateJWT);

/** routes */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/messages", messageRoutes);
app.use("/matches", matchesRoutes);



/** 404 handler: matches unmatched routes; raises NotFoundError. */
app.use(function (req, res, next) {
  throw new NotFoundError();
});

/** Error handler: logs stacktrace and returns JSON error message. */
app.use(function (err, req, res, next) {
  const status = err.status || 500;
  const message = err.message;
  if (process.env.NODE_ENV !== "test") console.error(status, err.stack);
  return res.status(status).json({ error: { message, status } });
});

module.exports = app;
