const { searchFlights } = require("../services/flight.service");

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

module.exports = {
  getFlights,
};