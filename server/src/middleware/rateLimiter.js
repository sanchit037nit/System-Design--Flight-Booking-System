const requests = new Map();

const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 100;

function rateLimiter(req, res, next) {
    const userId = req.user?.id || req.ip;

    const now = Date.now();

    const record = requests.get(userId);

    if (!record || now - record.startTime >= WINDOW_MS) {
        requests.set(userId, {
            count: 1,
            startTime: now
        });

        return next();
    }

    if (record.count >= MAX_REQUESTS) {
        return res.status(429).json({
            success: false,
            message: "Too many requests. Please try again later."
        });
    }

    record.count++;

    next();
}

module.exports = rateLimiter;