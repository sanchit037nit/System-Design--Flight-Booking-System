const flightRepository =
    require("../repositories/flightRepository");

async function searchFlights(
    departure,
    arrival,
    date
) {
    if (!departure || !arrival || !date) {
        throw new Error("Invalid search parameters");
    }

    return await flightRepository.findFlights(
        departure,
        arrival,
        date
    );
}

module.exports = {
    searchFlights
};