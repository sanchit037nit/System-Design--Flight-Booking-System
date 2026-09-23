const flightService = require("../services/flight.service");

const getFlights = async (req, res, next) => {
  try {
    const flights = await flightService.getFlights();

    res.status(200).json({
      success: true,
      data: flights
    });
  } catch (error) {
    next(error);
  }
};

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