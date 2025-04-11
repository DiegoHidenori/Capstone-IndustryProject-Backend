const jwt = require("jsonwebtoken");
const { User, Token } = require("../models");
const { Op } = require("sequelize");

const ACCESS_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET_KEY;
const ACCESS_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "15m";
const REFRESH_EXPIRES_IN = process.env.REFRESH_EXPIRES_IN || "7d";

// 🔧 Normalize empty strings to null
function normalizeOptionalFields(obj, fields) {
	for (let field of fields) {
		if (typeof obj[field] === "string" && obj[field].trim() === "") {
			obj[field] = null;
		}
	}
}

// 🔧 Centralized error logging
function logError(location, err) {
	console.error(`[AuthController] ${location}:`, err.message || err);
}

// 🔐 Generate JWTs
function generateAccessToken(user) {
	return jwt.sign({ userId: user.userId, role: user.role }, ACCESS_SECRET, {
		expiresIn: ACCESS_EXPIRES_IN,
	});
}

function generateRefreshToken(user) {
	return jwt.sign({ userId: user.userId }, REFRESH_SECRET, {
		expiresIn: REFRESH_EXPIRES_IN,
	});
}

// 🔐 Async Token Verification
function verifyToken(token, secret) {
	return new Promise((resolve, reject) => {
		jwt.verify(token, secret, (err, decoded) => {
			if (err) reject(err);
			else resolve(decoded);
		});
	});
}

module.exports = {
	// 🔹 Register a new user
	register: async (req, res) => {
		try {
			const {
				firstName,
				middleName,
				lastName,
				email,
				phone,
				password,
				billingAddress,
			} = req.body;

			// Validate required fields
			if (!firstName || !lastName || !email || !password) {
				return res.status(400).json({
					message:
						"Missing required fields: firstName, lastName, email, or password.",
				});
			}

			// Check if email already exists
			const existingUser = await User.findOne({ where: { email } });
			if (existingUser) {
				return res
					.status(400)
					.json({ message: "Email already exists" });
			}

			const newUserData = {
				firstName,
				middleName,
				lastName,
				email,
				phone,
				password,
				billingAddress,
				role: "guest",
			};

			normalizeOptionalFields(newUserData, [
				"middleName",
				"phone",
				"billingAddress",
			]);

			const newUser = await User.create(newUserData);

			res.status(201).json({
				message: "User registered successfully",
				user: {
					userId: newUser.userId,
					email: newUser.email,
					role: newUser.role,
				},
			});
		} catch (err) {
			logError("Register", err);
			res.status(500).json({
				message: "Error registering user",
				error: err,
			});
		}
	},

	// 🔐 Login
	login: async (req, res) => {
		try {
			const { email, password } = req.body;

			const user = await User.findOne({ where: { email } });
			if (!user || !(await user.validPassword(password))) {
				return res
					.status(401)
					.json({ message: "Invalid email or password" });
			}

			const accessToken = generateAccessToken(user);
			const refreshToken = generateRefreshToken(user);

			await Token.create({
				userId: user.userId,
				token: refreshToken,
				expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
			});

			res.json({
				message: "Login successful",
				accessToken,
				refreshToken,
			});
		} catch (err) {
			logError("Login", err);
			res.status(500).json({ message: "Error logging in", error: err });
		}
	},

	// 🔄 Refresh access token
	refreshToken: async (req, res) => {
		try {
			const { refreshToken } = req.body;

			if (!refreshToken) {
				return res
					.status(401)
					.json({ message: "No refresh token provided" });
			}

			const tokenRecord = await Token.findOne({
				where: { token: refreshToken },
			});

			if (!tokenRecord) {
				return res.status(403);
				json({ message: "Invalid refresh token" });
			}

			const decoded = await verifyToken(refreshToken, REFRESH_SECRET);

			const user = await User.findByPk(decoded.userId);
			if (!user) {
				return res.status(404).json({ message: "User not found" });
			}

			const newAccessToken = generateAccessToken(user);
			res.json({ accessToken: newAccessToken });
		} catch (err) {
			logError("Refresh Token", err);
			res.status(403).json({
				message: "Invalid or expired refresh token",
			});
		}
	},

	// 🔒 Logout
	logout: async (req, res) => {
		try {
			const { refreshToken } = req.body;

			if (!refreshToken) {
				return res
					.status(400)
					.json({ message: "Refresh token required" });
			}

			await Token.destroy({ where: { token: refreshToken } });

			res.json({ message: "Logged out successfully" });
		} catch (err) {
			logError("Logout", err);
			res.status(500).json({ message: "Error logging out", error: err });
		}
	},

	// 👤 Get Logged-In User (via JWT)
	getCurrentUser: async (req, res) => {
		try {
			const { userId } = req.user;

			const user = await User.findByPk(userId, {
				attributes: { exclude: ["password"] },
			});

			if (!user) {
				return res.status(404).json({ message: "User not found" });
			}

			res.json(user);
		} catch (err) {
			logError("GetCurrentUser", err);
			res.status(500).json({
				message: "Failed to fetch user",
				error: err,
			});
		}
	},

	// 🧹 Clean up expired refresh tokens
	cleanupExpiredTokens: async (req, res) => {
		try {
			const result = await Token.destroy({
				where: {
					expiresAt: {
						[Op.lt]: new Date(),
					},
				},
			});

			res.json({
				message: `Cleaned up ${result} expired token(s).`,
			});
		} catch (err) {
			logError("Cleanup Tokens", err);
			res.status(500).json({
				message: "Failed to clean up tokens.",
				error: err.message,
			});
		}
	},
};
