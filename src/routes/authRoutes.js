const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const authController = require("../controllers/authController");
const {
	authenticateUser,
	authorizeRoles,
} = require("../middleware/authMiddleware");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh", authController.refreshToken);
router.post("/logout", authController.logout);

router.get("/profile", authenticateUser, (req, res) => {
	res.json({ message: "Welcome to your profile", user: req.user });
});

router.get(
	"/admin",
	authenticateUser,
	authorizeRoles(["admin"]),
	(req, res) => {
		res.json({ message: "Welcome, Admin" });
	}
);

module.exports = router;
