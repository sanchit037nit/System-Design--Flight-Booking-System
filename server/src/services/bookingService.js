const Booking = require("../models/Booking");
const eventBus = require("../events/eventBus");
const { BOOKING_CREATED } = require("../events/bookingEvents");

async function createBooking(data) {
    const booking = await Booking.create(data);

    eventBus.emit(BOOKING_CREATED, {
        bookingId: booking.id,
        userId: booking.userId
    });

    return booking;
}

module.exports = {
    createBooking
};