const flightService =
    require("../services/flightService");

async function searchFlights(req, res) {
    try {

        const {
            departure,
            arrival,
            date
        } = req.query;

        const flights =
            await flightService.searchFlights(
                departure,
                arrival,
                date
            );

        res.json({
            success: true,
            data: flights
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
}

module.exports = {
    searchFlights
};