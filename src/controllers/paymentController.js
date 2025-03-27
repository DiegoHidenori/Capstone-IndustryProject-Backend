const { Payment, Booking, Invoice } = require("../models");

module.exports = {
    // Simulated payment checkout
    checkout: async (req, res) => {
        try {
            console.log("Received body: ", req.body);
            const { invoiceId, paymentType, amountPaid } = req.body;

            if (!invoiceId || !amountPaid || !paymentType) {
                return res.status(400).json({
                    message: "Missing required fields",
                    receivedData: req.body,
                });
            }

            const invoice = await Invoice.findByPk(invoiceId);
            if (!invoice) {
                return res.status(404).json({ message: "Invoice not found" });
            }

            let expectedAmount = 0;
            if (paymentType === "deposit") {
                expectedAmount = invoice.depositAmount;
            } else if (paymentType === "final_payment") {
                expectedAmount = invoice.totalAmount - invoice.depositAmount;
            } else {
                return res
                    .status(400)
                    .json({ message: "Invalid payment type" });
            }

            // Validate if amountPaid meets expected amount
            if (amountPaid < expectedAmount) {
                return res.status(400).json({
                    message: `Invalid payment amount. Expected at least: $${expectedAmount}`,
                });
            }

            // ✅ Generate a unique transaction ID
            const transactionId = `txn_${Math.floor(Math.random() * 1000000)}`;

            // ✅ Save payment with transactionId
            const payment = await Payment.create({
                invoiceId,
                transactionId,
                amountPaid,
                paymentType,
                status: "pending",
            });

            console.log("✅ Payment Created:", payment);

            // Simulate webhook call (Pretend this is an external payment gateway)
            setTimeout(async () => {
                console.log(
                    `✅ Simulated payment for Transaction: ${transactionId}`
                );

                // Call webhook to update system
                await fetch("http://localhost:5000/payments/webhook", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        transactionId, // ✅ Use transactionId instead of invoiceId
                        status: "successful",
                    }),
                });
            }, 2000); // Simulated delay

            res.json({
                message: "Payment initiated, waiting for confirmation",
                transactionId,
                expectedAmount,
            });
        } catch (err) {
            console.error("Error in checkout:", err);
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

            console.log(
                `🔍 Webhook received for Transaction: ${transactionId} with status: ${status}`
            );

            // ✅ Find payment using transactionId
            const payment = await Payment.findOne({ where: { transactionId } });

            if (!payment) {
                console.error(
                    `❌ Payment not found for transaction: ${transactionId}`
                );
                return res.status(404).json({ message: "Payment not found" });
            }

            console.log(
                `✅ Payment found: ${payment.transactionId} (Current Status: ${payment.status})`
            );

            // ✅ Update payment status
            payment.status = status;
            await payment.save();
            console.log(
                `✅ Payment ${payment.transactionId} updated to: ${status}`
            );

            // ✅ Find invoice linked to this payment
            const invoice = await Invoice.findByPk(payment.invoiceId);
            if (!invoice) {
                console.error(
                    `Invoice not found for payment: ${payment.transactionId}`
                );
                return res.status(404).json({ message: "Invoice not found" });
            }

            console.log(
                `✅ Invoice found: ${invoice.invoiceId} (Current Status: ${invoice.status})`
            );

            // ✅ Find booking linked to the invoice
            const booking = await Booking.findByPk(invoice.bookingId);
            if (!booking) {
                console.error(`Booking not found for invoice: ${invoice.id}`);
                return res.status(404).json({ message: "Booking not found" });
            }

            console.log(
                `✅ Booking found: $booking.bookingId} (Current Payment Status: ${invoice.status})`
            );

            // ✅ Calculate total paid amount for the invoice
            const totalPaid = await Payment.sum("amountPaid", {
                where: { invoiceId: invoice.invoiceId, status: "successful" },
            });

            console.log(
                `💰 Total Paid for Invoice ${invoice.invoiceId}: $${totalPaid}`
            );
            console.log(
                `💳 Invoice Total: $${invoice.totalAmount}, Deposit Required: $${invoice.depositAmount}`
            );

            // ✅ Update invoice status based on total paid
            if (totalPaid >= invoice.totalAmount) {
                invoice.status = "fully_paid";
            } else if (totalPaid >= invoice.depositAmount) {
                invoice.status = "deposit_paid";
            }
            await invoice.save();

            console.log(
                `✅ Invoice ${invoice.invoiceId} updated to: ${invoice.status}`
            );

            // // ✅ Sync booking payment status with invoice
            // booking.paymentStatus = invoice.status;
            // await booking.save();
            // console.log(
            //     `✅ Booking ${booking.bookingId} payment status updated to: ${booking.paymentStatus}`
            // );

            res.json({
                message: "Payment status updated successfully",
                invoiceStatus: invoice.status,
            });
        } catch (err) {
            console.error("❌ Webhook Error:", err);
            res.status(500).json({
                message: "Error processing webhook",
                error: err,
            });
        }
    },
};
