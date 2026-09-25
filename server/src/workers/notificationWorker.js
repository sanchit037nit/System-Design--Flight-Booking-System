const eventBus = require("../events/eventBus");
const { BOOKING_CREATED } = require("../events/bookingEvents");
const retry = require("../utils/retry");

async function sendEmail(bookingId, userId) {
    console.log(
        `Sending booking confirmation email for booking ${bookingId}`
    );

    // Email provider API will go here later
}

async function sendSms(bookingId, userId) {
    console.log(
        `Sending booking confirmation SMS for booking ${bookingId}`
    );

    // SMS provider API will go here later
}

eventBus.on(BOOKING_CREATED, async ({ bookingId, userId }) => {
    try {
        // Retry email
        await retry(
            () => sendEmail(bookingId, userId),
            {
                retries: 3,
                baseDelay: 1000
            }
        );

        // Retry SMS
        await retry(
            () => sendSms(bookingId, userId),
            {
                retries: 3,
                baseDelay: 1000
            }
        );

        console.log(
            `Notification completed for booking ${bookingId}`
        );

    } catch (error) {
        console.error(
            `Notification failed after retries for booking ${bookingId}`,
            error
        );

        // Later this is where you would send the event
        // to a Dead Letter Queue.
    }
});

module.exports = {};