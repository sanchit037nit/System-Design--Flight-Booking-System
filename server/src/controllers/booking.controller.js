const pool = require("../config/db");

const createBooking = async (req, res) => {
    const connection = await pool.getConnection();

    try {
        const { flightId, seatId } = req.body;
        const userId = req.user.id;

        await connection.beginTransaction();

        // Check seat
        const [seats] = await connection.query(
            `
            SELECT *
            FROM seats
            WHERE id = ?
            AND flight_id = ?
            `,
            [seatId, flightId]
        );

        if (seats.length === 0) {
            await connection.rollback();

            return res.status(404).json({
                message: "Seat not found"
            });
        }

        if (seats[0].status === "BOOKED") {
            await connection.rollback();

            return res.status(409).json({
                message: "Seat already booked"
            });
        }

        // Create booking
        const [booking] = await connection.query(
            `
            INSERT INTO bookings
            (user_id, flight_id, seat_id)
            VALUES (?, ?, ?)
            `,
            [userId, flightId, seatId]
        );

        // Mark seat booked
        await connection.query(
            `
            UPDATE seats
            SET status = 'BOOKED'
            WHERE id = ?
            `,
            [seatId]
        );

        await connection.commit();

        res.status(201).json({
            message: "Booking successful",
            bookingId: booking.insertId
        });

    } catch (error) {

        await connection.rollback();

        console.error(error);

        res.status(500).json({
            message: "Booking failed"
        });

    } finally {
        connection.release();
    }
};