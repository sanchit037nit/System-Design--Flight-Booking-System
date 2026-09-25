const {
  searchFlights,
  updateFlight: updateFlightService,
} = require("../services/flight.service");

async function getFlights(req, res, next) {
  try {
    const { from, to } = req.query;

    const result = await searchFlights(from, to);

    res.status(200).json({
      success: true,
      source: result.source,
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
}

async function updateFlight(req, res, next) {
  try {
    const { id } = req.params;

    const result = await updateFlightService(id, req.body);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getFlights,
  updateFlight,
};