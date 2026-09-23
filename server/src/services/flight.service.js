
const flights = [
  {
    id: "FL001",
    flightNumber: "AI101",
    airline: "Air India",
    source: "DEL",
    destination: "BOM",
    price: 5500
  },
  {
    id: "FL002",
    flightNumber: "6E202",
    airline: "IndiGo",
    source: "DEL",
    destination: "BLR",
    price: 6200
  }
];




async function getFlights(query) {

const filter = {};

if (query.from) {
  filter.from = query.from.toUpperCase();
}

if (query.to) {
  filter.to = query.to.toUpperCase();
}

const page = Math.max(Number(query.page) || 1, 1);
const sort = query.sort || "departureTime";
const limit = Math.min(
  Math.max(Number(query.limit) || 10, 1),
  100
);

const skip = (page - 1) * limit;

  const [flights, total] = await Promise.all([
    Flight.find({})
      .skip(skip)
      .limit(limit),

    Flight.countDocuments({})
  ]);

  return {
    data: flights,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
}

const getFlightById = async (id) => {
  const flight = flights.find((flight) => flight.id === id);

  if (!flight) {
    const error = new Error("Flight not found");
    error.statusCode = 404;

    throw error;
  }

  return flight;
};

const createFlight = async (flightData) => {
  const newFlight = {
    id: `FL${String(flights.length + 1).padStart(3, "0")}`,
    ...flightData
  };

  flights.push(newFlight);

  return newFlight;
};

module.exports = {
  getFlights,
  getFlightById,
  createFlight
};