const { Payment, Booking, Invoice } = require("../models");

module.exports = {
    // Simulated payment checkout
    checkout: async (req, res) => {
        try {
            console.log("Received body: ", req.body);
            const { bookingId, paymentType, amountPaid } = req.body;

            if (!bookingId || !amountPaid || !paymentType) {
                return res.status(400).json({
                    message: "Missing required fields",
                    receivedData: req.body, // Debugging: Show received data
                });
            }

            // Validate booking
            const booking = await Booking.findByPk(bookingId);
            if (!booking) {
                return res.status(404).json({ message: "Booking not found" });
            }

            let amountToPay = 0;
            if (paymentType === "deposit") {
                amountToPay = booking.bookingPrice * 0.2; // 20% deposit
            } else if (paymentType === "full") {
                amountToPay = booking.bookingPrice - booking.depositAmount; // Remaining balance
            } else {
                return res
                    .status(400)
                    .json({ message: "Invalid payment type" });
            }

            // Simulating payment processing
            const fakeTransactionId = `txn_${Math.floor(
                Math.random() * 1000000
            )}`;

            // Save payment record
            const payment = await Payment.create({
                bookingId,
                amountPaid: amountToPay,
                paymentType,
                transactionId: fakeTransactionId,
                status: "pending", // Will be updated via webhook
            });

            res.json({
                message: "Payment initiated, waiting for confirmation",
                transactionId: fakeTransactionId,
                amount: amountToPay,
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({
                message: "Error processing payment",
                error: err,
            });
        }
    },

    // Simulated payment webhook (called by the payment gateway)
    webhook: async (req, res) => {
        try {
            const { transactionId, status } = req.body;

            // Find the payment
            const payment = await Payment.findOne({ where: { transactionId } });
            if (!payment) {
                return res.status(404).json({ message: "Payment not found" });
            }

            // Update payment status
            payment.status = status;
            await payment.save();

            // If payment is successful, update booking paymentStatus
            if (status === "successful") {
                const booking = await Booking.findByPk(payment.bookingId);
                if (booking) {
                    if (payment.amount === booking.bookingPrice * 0.2) {
                        booking.paymentStatus = "deposit_paid";
                    } else {
                        booking.paymentStatus = "fully_paid";
                    }
                    await booking.save();
                }
            }

            res.json({ message: "Payment status updated" });
        } catch (err) {
            console.error(err);
            res.status(500).json({
                message: "Error processing webhook",
                error: err,
            });
        }
    },
};
