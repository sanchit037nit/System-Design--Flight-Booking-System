const crypto = require("crypto");

function createEvent(type, payload) {
    return {
        eventId: crypto.randomUUID(),
        type,
        payload,
        createdAt: new Date().toISOString()
    };
}

module.exports = {
    createEvent
};