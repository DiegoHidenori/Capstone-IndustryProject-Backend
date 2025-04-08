const jwt = require("jsonwebtoken");
const { User } = require("../models");

const ACCESS_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET_KEY;
const ACCESS_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "15m";
const REFRESH_EXPIRES_IN = process.env.REFRESH_EXPIRES_IN || "7d";

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

module.exports = {
	// 🔹 Register a New User
	register: async (req, res) => {
		try {
			const { firstName, lastName, email, password, role } = req.body;

			const existingUser = await User.findOne({ where: { email } });
			if (existingUser) {
				return res
					.status(400)
					.json({ message: "Email already exists" });
			}

			// 🔹 Create user (password is auto-hashed by Sequelize hooks)
			const newUser = await User.create({
				firstName,
				lastName,
				email,
				password,
				role: role || "guest",
			});

			res.status(201).json({
				message: "User registered successfully",
				user: {
					userId: newUser.userId,
					email: newUser.email,
					role: newUser.role,
				},
			});
		} catch (err) {
			console.error("Register error:", err);
			res.status(500).json({
				message: "Error registering user",
				error: err,
			});
		}
	},

	// 🔹 User Login & JWT Token Generation
	login: async (req, res) => {
		try {
			const { email, password } = req.body;

			// 🔹 Find user by email
			const user = await User.findOne({ where: { email } });
			if (!user || !(await user.validPassword(password))) {
				return res
					.status(401)
					.json({ message: "Invalid email or password" });
			}

			const accessToken = generateAccessToken(user);
			const refreshToken = generateRefreshToken(user);

			res.json({
				message: "Login successful",
				accessToken,
				refreshToken,
			});
		} catch (err) {
			res.status(500).json({ message: "Error logging in", error: err });
		}
	},

	// 🔄 Refresh JWT Token
	refreshToken: async (req, res) => {
		try {
			const { token: refreshTokenFromClient } = req.body;

			if (!refreshTokenFromClient) {
				return res
					.status(401)
					.json({ message: "Access denied — no token provided" });
			}

			jwt.verify(
				refreshTokenFromClient,
				REFRESH_SECRET,
				(err, decoded) => {
					if (err)
						return res
							.status(403)
							.json({ message: "Invalid refresh token" });

					// 🔹 Generate new Access Token
					const newAccessToken = jwt.sign(
						{ userId: decoded.userId },
						ACCESS_SECRET,
						{ expiresIn: ACCESS_EXPIRES_IN }
					);

					res.json({ accessToken: newAccessToken });
				}
			);
		} catch (err) {
			res.status(500).json({
				message: "Error refreshing token",
				error: err,
			});
		}
	},
};
