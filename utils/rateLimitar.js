const { default: rateLimit } = require("express-rate-limit");

const limiter = () => {
    try {
        return rateLimit({
            windowMs: 5 * 60 * 1000,
            limit: 10,
            standardHeaders: 'draft-8',
            legacyHeaders: false,
            ipv6Subnet: 56,
            message: "You have hit too many times in certain period ! Wait and try again later."
        });
    } catch (error) {
        console.log("Error in rate limiter", error);
        return (req, res, next) => next(); 
    }
};

module.exports = limiter();
