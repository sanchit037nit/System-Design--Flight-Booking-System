const pool = require("../config/db");

async function findFlights(
    departureAirport,
    arrivalAirport,
    date
) {
    const [rows] = await pool.execute(
        `
        SELECT
            f.id,
            f.flight_number,
            f.departure_time,
            f.arrival_time
        FROM flights f
        WHERE f.departure_airport_id = ?
          AND f.arrival_airport_id = ?
          AND DATE(f.departure_time) = ?
        `,
        [
            departureAirport,
            arrivalAirport,
            date
        ]
    );

    return rows;
}

module.exports = {
    findFlights
};