const flightService = require("../services/flight.service");

const {
  successResponse
} = require("../utils/response");


async function getFlights(req, res, next) {
  try {
    const result = await flightService.getFlights(req.query);

    return successResponse(res, result);
  } catch (error) {
    next(error);
  }
}

const getFlightById = async (req, res, next) => {
  try {
    const flight = await flightService.getFlightById(req.params.id);

    res.status(200).json({
      success: true,
      data: flight
    });
  } catch (error) {
    next(error);
  }
};

const createFlight = async (req, res, next) => {
  try {
    const flight = await flightService.createFlight(req.body);

    res.status(201).json({
      success: true,
      data: flight
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFlights,
  getFlightById,
  createFlight
};