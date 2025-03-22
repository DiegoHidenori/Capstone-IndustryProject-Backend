const jwt = require("jsonwebtoken");

// Middleware to verify token and attach user to req
const authenticateUser = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Expecting header like: Authorization: Bearer <token>
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res
            .status(401)
            .json({ message: "Authorization header missing or malformed" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { id, role }
        next();
    } catch (err) {
        console.error("Token verification failed:", err);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

// Middleware to restrict access by role
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res
                .status(403)
                .json({ message: "Forbidden: insufficient permissions" });
        }
        next();
    };
};

module.exports = {
    authenticateUser,
    authorizeRoles,
};
