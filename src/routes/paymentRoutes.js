const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

router.post("/checkout", paymentController.checkout);
router.post("/webhook", paymentController.webhook);

module.exports = router;
