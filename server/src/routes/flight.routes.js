const express = require("express");

const flightController = require("../controllers/flight.controller");

const router = express.Router();

router.get("/", flightController.getFlights);

router.get("/:id", flightController.getFlightById);

router.post("/", flightController.createFlight);

module.exports = router;