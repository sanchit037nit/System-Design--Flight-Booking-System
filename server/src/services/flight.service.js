const pool = require("../config/db");
const { redisClient } = require("../config/redis");
const { flightSearchKey } = require("../utils/cacheKeys");

async function searchFlights(from, to) {
  const cacheKey = flightSearchKey(from, to);

  let cachedFlights;

  try {
    cachedFlights = await redisClient.get(cacheKey);
  } catch (error) {
    console.error("Redis read failed:", error.message);
  }

  if (cachedFlights) {
    return {
      data: JSON.parse(cachedFlights),
      source: "cache",
    };
  }

  const [rows] = await pool.query(
    `
      SELECT *
      FROM flights
      WHERE departure_airport = ?
      AND arrival_airport = ?
    `,
    [from, to]
  );

    try {
      
         const ttl = Number(process.env.FLIGHT_CACHE_TTL || 60);
  await redisClient.set(
    cacheKey,
    JSON.stringify(rows),
    {
      EX: ttl,
    }
  );
  } catch (error) {
    console.error("Redis write failed:", error.message);
  }

  return {
    data: rows,
    source: "database",
  };
}

module.exports = {
  searchFlights,
};