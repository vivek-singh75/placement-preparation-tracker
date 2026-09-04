const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        const token = req.cookies.cookie;
        if (!token) {
            return res.status(401).json({
                message: "Authentication required"
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET_KEY
        );

        req.user = decoded;

        next();

    } catch (error) {
        console.log("Authentication error:", error);

        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};

module.exports = {authMiddleware};