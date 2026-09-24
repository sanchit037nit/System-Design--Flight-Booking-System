const express = require("express");

const flightRoutes = require("./routes/flight.routes");
const requestLogger = require("./middleware/requestLogger");
const errorHandler = require("./middleware/errorHandler");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const adminRoutes = require("./routes/admin.routes");


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
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/admin", adminRoutes);

app.use(errorHandler);

module.exports = app;