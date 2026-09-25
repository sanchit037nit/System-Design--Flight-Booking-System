const { createEvent } = require("../events/eventBus");

const event = createEvent(
    BOOKING_CREATED,
    {
        bookingId: booking.id,
        userId: booking.userId
    }
);

eventBus.emit(BOOKING_CREATED, event);