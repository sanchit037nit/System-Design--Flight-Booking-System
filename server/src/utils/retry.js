function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

async function retry(fn, options = {}) {
    const {
        retries = 3,
        baseDelay = 1000
    } = options;

    let attempt = 0;

    while (attempt <= retries) {
        try {
            return await fn();
        } catch (error) {
            attempt++;

            if (attempt > retries) {
                throw error;
            }

            const delay =
                baseDelay * Math.pow(2, attempt - 1);

            console.log(
                `Retry attempt ${attempt} in ${delay}ms`
            );

            await sleep(delay);
        }
    }
}

module.exports = retry;