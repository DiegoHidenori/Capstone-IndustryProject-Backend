const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User } = require("../models");

// const SECRET_KEY = "your_secret_key"; // 🔹 Store this in .env
// const REFRESH_SECRET_KEY = "your_refresh_secret_key"; // 🔹 Store this in .env

module.exports = {
    // 🔹 Register a New User
    register: async (req, res) => {
        try {
            const { firstName, lastName, email, password, role } = req.body;

            // 🔹 Check if user already exists
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

            // 🔹 Generate Access & Refresh Tokens
            const accessToken = jwt.sign(
                { userId: user.userId, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN || "15m" } // 🔹 Short-lived token
            );

            const refreshToken = jwt.sign(
                { userId: user.userId },
                process.env.REFRESH_SECRET_KEY,
                { expiresIn: "7d" } // 🔹 Long-lived token
            );

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
            const { token } = req.body;
            if (!token)
                return res.status(401).json({ message: "Access Denied" });

            jwt.verify(
                token,
                process.env.REFRESH_SECRET_KEY,
                (err, decoded) => {
                    if (err)
                        return res
                            .status(403)
                            .json({ message: "Invalid refresh token" });

                    // 🔹 Generate new Access Token
                    const newAccessToken = jwt.sign(
                        { userId: decoded.id },
                        process.env.SECRET_KEY,
                        { expiresIn: "15m" }
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
