const { Booking, Invoice, User, Room, Meal, Discount } = require("../models");

module.exports = {
    getAllInvoices: async (req, res) => {
        try {
            const invoices = await Invoice.findAll();
            res.status(200).json(invoices);
        } catch (error) {
            res.status(500).json({
                message: "Error retrieving invoices",
                error,
            });
        }
    },
    getInvoice: async (req, res) => {
        try {
            const invoice = await Invoice.findOne({
                where: { bookingId: req.params.bookingId },
                include: [
                    { model: Booking, include: [User, Room, Meal, Discount] },
                ],
            });

            if (!invoice) {
                return res.status(404).json({ message: "Invoice not found" });
            }

            res.json(invoice);
        } catch (err) {
            res.status(500).json({
                message: "Error fetching invoice",
                error: err,
            });
        }
    },
    getInvoicesByUser: async (req, res) => {
        try {
            const invoices = await Invoice.findAll({
                where: { userId: req.user.userId },
            });
            res.status(200).json(invoices);
        } catch (error) {
            res.status(500).json({
                message: "Error retrieving invoices",
                error,
            });
        }
    },
};
