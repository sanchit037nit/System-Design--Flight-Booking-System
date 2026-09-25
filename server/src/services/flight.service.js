const pool = require("../config/db");
const { redisClient } = require("../config/redis");
const { flightSearchKey } = require("../utils/cacheKeys");

async function searchFlights(from, to) {
  const cacheKey = flightSearchKey(from, to);

  // 1. Check Redis
  const cachedFlights = await redisClient.get(cacheKey);

  if (cachedFlights) {
    return {
      data: JSON.parse(cachedFlights),
      source: "cache",
    };
  }

  // 2. Cache miss → query MySQL
  const [rows] = await pool.query(
    `
      SELECT *
      FROM flights
      WHERE departure_airport = ?
      AND arrival_airport = ?
    `,
    [from, to]
  );

  // 3. Store result in Redis
  await redisClient.set(
    cacheKey,
    JSON.stringify(rows)
  );

  return {
    data: rows,
    source: "database",
  };
}

module.exports = {
  searchFlights,
};