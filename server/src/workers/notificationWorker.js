const eventBus = require("../events/eventBus");
const { BOOKING_CREATED } = require("../events/bookingEvents");

async function sendEmail(bookingId, userId) {
    console.log(
        `Sending booking confirmation email for booking ${bookingId}`
    );

    // Email provider call would go here.
}

async function sendSms(bookingId, userId) {
    console.log(
        `Sending booking confirmation SMS for booking ${bookingId}`
    );

    // SMS provider call would go here.
}

eventBus.on(BOOKING_CREATED, async ({ bookingId, userId }) => {
    try {
        await sendEmail(bookingId, userId);
        await sendSms(bookingId, userId);

        console.log(
            `Notification completed for booking ${bookingId}`
        );
    } catch (error) {
        console.error(
            `Notification failed for booking ${bookingId}`,
            error
        );
    }
});

module.exports = {};