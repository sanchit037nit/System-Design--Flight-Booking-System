const express = require("express");

const flightRoutes = require("./routes/flight.routes");
const requestLogger = require("./middleware/requestLogger");
const errorHandler = require("./middleware/errorHandler");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const adminRoutes = require("./routes/admin.routes");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const bookingRoutes=require("./routes/booking.routes")

const app = express();
const cors = require("cors");
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20
});
const requestTimer = require("./middleware/requestTimer");

app.use(requestTimer);
app.use(express.json());
app.use(helmet());
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
app.use("/api/v1/bookings", bookingRoutes);

app.use("/api/v1/auth/login", authLimiter);
app.use(errorHandler);
app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true
    })
);

module.exports = app;