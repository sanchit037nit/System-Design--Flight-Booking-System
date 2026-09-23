const express = require("express");

const flightRoutes = require("./routes/flight.routes");

const app = express();

app.use(express.json());

app.use("/api/flights", flightRoutes);

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Server is healthy"
  });
});

module.exports = app;