const express = require("express");

const flightRoutes = require("./routes/flight.routes");
const requestLogger = require("./middleware/requestLogger");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(express.json());

app.use(requestLogger);

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Server is healthy"
  });
});

app.use("/api/v1/flights", flightRoutes);

app.use(errorHandler);

module.exports = app;