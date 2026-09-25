const pool = require("../config/db");

const createBooking = async (req, res) => {
    const connection = await pool.getConnection();

    try {
        const { flightId, seatId } = req.body;
        const userId = req.user.id;

        await connection.beginTransaction();

        // Lock the seat row
        const [seats] = await connection.query(
            `
            SELECT id, flight_id, seat_number, status
            FROM seats
            WHERE id = ?
            AND flight_id = ?
            FOR UPDATE
            `,
            [seatId, flightId]
        );

        if (seats.length === 0) {
            await connection.rollback();

            return res.status(404).json({
                message: "Seat not found"
            });
        }

        const seat = seats[0];

        if (seat.status !== "AVAILABLE") {
            await connection.rollback();

            return res.status(409).json({
                message: "Seat already booked"
            });
        }

        // Create booking
        const [booking] = await connection.query(
            `
            INSERT INTO bookings
            (user_id, flight_id, seat_id, status)
            VALUES (?, ?, ?, 'CONFIRMED')
            `,
            [userId, flightId, seatId]
        );

        // Mark seat as booked
        await connection.query(
            `
            UPDATE seats
            SET status = 'BOOKED'
            WHERE id = ?
            `,
            [seatId]
        );

        await connection.commit();

        return res.status(201).json({
            message: "Booking successful",
            bookingId: booking.insertId
        });

    } catch (error) {

        await connection.rollback();

        console.error("Booking error:", error);

        return res.status(500).json({
            message: "Booking failed"
        });

    } finally {
        connection.release();
    }
};