const jwt = require("jsonwebtoken");

const ACCESS_SECRET = process.env.JWT_SECRET;

module.exports = {
	authenticateUser: async (req, res, next) => {
		try {
			const authHeader = req.headers.authorization;
			if (!authHeader || !authHeader.startsWith("Bearer ")) {
				return res
					.status(401)
					.json({ message: "Access token required" });
			}

			const token = authHeader.split(" ")[1];
			const decoded = jwt.verify(token, ACCESS_SECRET);

			req.user = {
				userId: decoded.userId,
				role: decoded.role,
			};

			next();
		} catch (err) {
			console.error("Auth middleware error:", err);
			return res
				.status(401)
				.json({ message: "Invalid or expired access token" });
		}
	},

	authorizeRoles:
		(...roles) =>
		(req, res, next) => {
			if (!roles.includes(req.user.role)) {
				return res
					.status(403)
					.json({ message: "Forbidden: Insufficient permissions" });
			}
			next();
		},
};
