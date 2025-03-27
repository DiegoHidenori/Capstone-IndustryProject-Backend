const express = require("express");
const router = express.Router();
const invoiceController = require("../controllers/invoiceController");
const {
    authenticateUser,
    authorizeRoles,
} = require("../middleware/authMiddleware");

router.get("/", authenticateUser, invoiceController.getAllInvoices);
router.get("/:bookingId", authenticateUser, invoiceController.getInvoice);
router.get(
    "/my-invoices",
    authenticateUser,
    invoiceController.getInvoicesByUser
);

module.exports = router;
