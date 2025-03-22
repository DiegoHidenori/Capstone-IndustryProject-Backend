const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { User } = require("../models");

// POST /auth/register
router.post("/register", async (req, res) => {
    try {
        const { firstName, lastName, email, password, role } = req.body;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: "Email already in use" });
        }

        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password,
            role: role || "guest", // default to guest if not provided
        });

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: newUser.id,
                email: newUser.email,
                role: newUser.role,
            },
        });
    } catch (err) {
        console.error("Register error:", err);
        res.status(500).json({ message: "Registration failed" });
    }
});

// POST /auth/login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user || !(await user.validPassword(password))) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
        );

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Login failed" });
    }
});

module.exports = router;
