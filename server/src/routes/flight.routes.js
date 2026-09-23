const express = require("express");

const flightController = require("../controllers/flight.controller");

const router = express.Router();

const {
  createFlight
} = require("../controllers/flight.controller");

const validate = require("../middleware/validate.middleware");

const {
  createFlightSchema
} = require("../validators/flight.validator");

router.get("/", flightController.getFlights);

router.get("/:id", flightController.getFlightById);

router.post(
  "/",
  validate(createFlightSchema),
  createFlight
);

module.exports = router;