const pool = require("../config/db");
const { redisClient } = require("../config/redis");

const {
  flightSearchKey,
  invalidateFlightSearchCache,
} = require("../utils/cacheKeys");

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


/**
 * Update a flight and invalidate affected search caches.
 */
async function updateFlight(id, data) {
  // 1. Get existing flight information
  const [existingRows] = await pool.query(
    `
      SELECT departure_airport, arrival_airport
      FROM flights
      WHERE id = ?
    `,
    [id]
  );

  if (existingRows.length === 0) {
    const error = new Error("Flight not found");
    error.statusCode = 404;
    throw error;
  }

  const oldFlight = existingRows[0];

  // 2. Determine new values
  const newFrom =
    data.departureAirport || oldFlight.departure_airport;

  const newTo =
    data.arrivalAirport || oldFlight.arrival_airport;

  // 3. Update MySQL
  await pool.query(
    `
      UPDATE flights
      SET departure_airport = ?,
          arrival_airport = ?,
          departure_time = ?
      WHERE id = ?
    `,
    [
      newFrom,
      newTo,
      data.departureTime,
      id,
    ]
  );

  // 4. Invalidate OLD route cache
  await invalidateFlightSearchCache(
    oldFlight.departure_airport,
    oldFlight.arrival_airport,
    redisClient
  );

  // 5. If route changed, invalidate NEW route cache too
  if (
    oldFlight.departure_airport !== newFrom ||
    oldFlight.arrival_airport !== newTo
  ) {
    await invalidateFlightSearchCache(
      newFrom,
      newTo,
      redisClient
    );
  }

  return {
    id,
    departureAirport: newFrom,
    arrivalAirport: newTo,
    departureTime: data.departureTime,
  };
}

module.exports = {
  searchFlights,
  updateFlight,
};