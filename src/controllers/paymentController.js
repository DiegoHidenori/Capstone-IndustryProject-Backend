const { Payment, Booking } = require("../models");

module.exports = {
    paymentWebhook: async (req, res) => {
        try {
            const { transactionId, bookingId, amountPaid, paymentType } =
                req.body;

            const booking = await Booking.findByPk(bookingId);
            if (!booking) {
                return res.status(404).json({ message: "Booking not found" });
            }

            // Store payment in the `Payments` table
            await Payment.create({
                transactionId,
                bookingId,
                amountPaid,
                paymentType,
                status: "successful",
            });

            // Update booking payment status
            if (paymentType === "deposit") {
                await booking.update({ paymentStatus: "deposit_paid" });
            } else if (paymentType === "final_payment") {
                await booking.update({ paymentStatus: "fully_paid" });
            }

            res.json({ message: "Payment recorded successfully" });
        } catch (err) {
            res.status(500).json({
                message: "Error processing payment",
                error: err,
            });
        }
    },
};
