const createBooking = async (req, res) => {
    const connection = await pool.getConnection();

    try {
        const { flightId, seatId } = req.body;
        const userId = req.user.id;

        const idempotencyKey =
            req.headers["idempotency-key"];

        if (!idempotencyKey) {
            return res.status(400).json({
                message: "Idempotency-Key is required"
            });
        }

        await connection.beginTransaction();

        // Check whether request was already processed
        const [existing] = await connection.query(
            `
            SELECT id, status
            FROM bookings
            WHERE idempotency_key = ?
            `,
            [idempotencyKey]
        );

        if (existing.length > 0) {
            await connection.rollback();

            return res.status(200).json({
                message: "Booking already processed",
                bookingId: existing[0].id
            });
        }

        // Lock seat
        const [seats] = await connection.query(
            `
            SELECT *
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

        if (seats[0].status !== "AVAILABLE") {
            await connection.rollback();

            return res.status(409).json({
                message: "Seat already booked"
            });
        }

        // Create booking
        const [booking] = await connection.query(
            `
            INSERT INTO bookings
            (
                user_id,
                flight_id,
                seat_id,
                status,
                idempotency_key
            )
            VALUES (?, ?, ?, 'CONFIRMED', ?)
            `,
            [
                userId,
                flightId,
                seatId,
                idempotencyKey
            ]
        );

        // Book seat
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

        console.error(error);

        return res.status(500).json({
            message: "Booking failed"
        });

    } finally {
        connection.release();
    }
};