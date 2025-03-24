const express = require("express");
const router = express.Router();
const invoiceController = require("../controllers/invoiceController");

router.get("/:bookingId", invoiceController.getInvoice);

module.exports = router;
