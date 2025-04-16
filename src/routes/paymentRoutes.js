const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const {
	authenticateUser,
	authorizeRoles,
} = require("../middleware/authMiddleware");

router.post("/checkout", authenticateUser, paymentController.checkout);
router.post("/webhook", paymentController.webhook);
// router.post("/manual-payment", paymentController.recordManualPayment);

module.exports = router;
