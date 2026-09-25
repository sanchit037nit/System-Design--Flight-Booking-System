const request = require("supertest");
const app = require("../app");

describe("Concurrent booking", () => {

    test("should prevent double booking", async () => {

        const flightId = 101;
        const seatId = 25;

        const request1 = request(app)
            .post("/api/v1/bookings")
            .set(
                "Authorization",
                "Bearer USER_A_TOKEN"
            )
            .set(
                "Idempotency-Key",
                "user-a-booking-001"
            )
            .send({
                flightId,
                seatId
            });

        const request2 = request(app)
            .post("/api/v1/bookings")
            .set(
                "Authorization",
                "Bearer USER_B_TOKEN"
            )
            .set(
                "Idempotency-Key",
                "user-b-booking-001"
            )
            .send({
                flightId,
                seatId
            });

        const [response1, response2] =
            await Promise.all([
                request1,
                request2
            ]);

        const statuses = [
            response1.status,
            response2.status
        ].sort();

        expect(statuses).toEqual([
            201,
            409
        ]);
    });
});