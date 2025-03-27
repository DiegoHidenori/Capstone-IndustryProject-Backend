const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const authController = require("../controllers/authController");
const {
    authenticateUser,
    authorizeRoles,
} = require("../middleware/authMiddleware");

// 🔑 Authentication Routes
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh", authController.refreshToken);

// 🛑 Protected Routes (Only logged-in users can access)
router.get("/profile", authenticateUser, (req, res) => {
    res.json({ message: "Welcome to your profile", user: req.user });
});

// 🛑 Admin Only Route
router.get(
    "/admin",
    authenticateUser,
    authorizeRoles(["admin"]),
    (req, res) => {
        res.json({ message: "Welcome, Admin" });
    }
);

module.exports = router;
