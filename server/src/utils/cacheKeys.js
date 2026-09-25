function flightSearchKey(from, to) {
  return `flights:search:${from}:${to}`;
}

async function invalidateFlightSearchCache(
  from,
  to,
  redisClient
) {
  const key = flightSearchKey(from, to);

  try {
    await redisClient.del(key);
  } catch (error) {
    console.error(
      "Failed to invalidate flight cache:",
      error.message
    );
  }
}

module.exports = {
  flightSearchKey,
  invalidateFlightSearchCache,
};