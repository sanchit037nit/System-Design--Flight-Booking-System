const pool = require("../config/db");

const createBooking = async (req, res) => {
    try {
        const { flightId, seatId } = req.body;
        const userId = req.user.id;

        // Check seat
        const [seats] = await pool.query(
            `
            SELECT *
            FROM seats
            WHERE id = ?
            AND flight_id = ?
            `,
            [seatId, flightId]
        );

        if (seats.length === 0) {
            return res.status(404).json({
                message: "Seat not found"
            });
        }

        const seat = seats[0];

        if (seat.status === "BOOKED") {
            return res.status(409).json({
                message: "Seat already booked"
            });
        }

        // Create booking
        const [result] = await pool.query(
            `
            INSERT INTO bookings
            (user_id, flight_id, seat_id)
            VALUES (?, ?, ?)
            `,
            [userId, flightId, seatId]
        );

        // Mark seat booked
        await pool.query(
            `
            UPDATE seats
            SET status = 'BOOKED'
            WHERE id = ?
            `,
            [seatId]
        );

        res.status(201).json({
            message: "Booking successful",
            bookingId: result.insertId
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Booking failed"
        });
    }
};

module.exports = {
    createBooking
};