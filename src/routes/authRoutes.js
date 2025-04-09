const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const {
	authenticateUser,
	authorizeRoles,
} = require("../middleware/authMiddleware");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh", authController.refreshToken);
router.post("/logout", authController.logout);

router.get("/me", authenticateUser, authController.getCurrentUser);

router.get(
	"/admin",
	authenticateUser,
	authorizeRoles(["admin"]),
	(req, res) => {
		res.json({ message: "Welcome, Admin" });
	}
);

router.delete(
	"/cleanup-tokens",
	authenticateUser,
	authorizeRoles("admin"), // Only admins can clean tokens
	authController.cleanupExpiredTokens
);

module.exports = router;
