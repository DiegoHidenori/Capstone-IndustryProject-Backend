const { Booking, Invoice, User, Room, Meal } = require("../models");

module.exports = {
    getInvoice: async (req, res) => {
        try {
            const invoice = await Invoice.findOne({
                where: { bookingId: req.params.bookingId },
                include: [{ model: Booking, include: [User, Room, Meal] }],
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
};
