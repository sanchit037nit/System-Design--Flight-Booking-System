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

const getFlights = async () => {
  return flights;
};

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