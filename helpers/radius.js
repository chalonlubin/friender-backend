const zipcodes = require("zipcodes");

/** Calculates distance between two users,
 *  then compares the distance(miles) to the radius(miles.)
 *
 *  Returns Boolean
 */
function inRadius(user1, user2) {
  const radius = user1.radius;
  const dist = zipcodes.distance(user1.location, user2.location);

  return dist <= radius;
}

module.exports = { inRadius };
