function flightSearchKey(from, to) {
  return `flights:search:${from}:${to}`;
}

module.exports = {
  flightSearchKey,
};