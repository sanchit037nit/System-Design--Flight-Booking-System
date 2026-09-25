const { redisClient } = require("../config/redis");

const WINDOW_SECONDS = 60;
const MAX_REQUESTS = 100;

async function rateLimiter(req, res, next) {
    try {
        const userId = req.user?.id || req.ip;

        const key = `rate_limit:${userId}`;

        const currentCount = await redisClient.incr(key);

        if (currentCount === 1) {
            await redisClient.expire(key, WINDOW_SECONDS);
        }

        if (currentCount > MAX_REQUESTS) {
            return res.status(429).json({
                success: false,
                message: "Too many requests. Please try again later."
            });
        }

        next();
    } catch (error) {
        next(error);
    }
}

module.exports = rateLimiter;