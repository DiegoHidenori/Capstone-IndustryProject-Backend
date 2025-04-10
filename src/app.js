const express = require("express");
const cors = require("cors");
require("express-async-errors");

const roomRoutes = require("./routes/roomRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const mealRoutes = require("./routes/mealRoutes");
const discountRoutes = require("./routes/discountRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");

const app = express();

// Middleware
app.use(
	cors({
		origin: "http://localhost:3000", // ✅ explicitly allow frontend
		credentials: true,
	})
);
app.use(express.json());
app.use("/api/rooms", roomRoutes);
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/meals", mealRoutes);
app.use("/api/discounts", discountRoutes);
app.use("/payments", paymentRoutes);
app.use("/invoices", invoiceRoutes);

// Test Route
app.get("/", (req, res) => {
	res.send("API is running...");
});

// Global Error Handler
app.use((err, req, res, next) => {
	console.error(err);
	res.status(500).json({ message: "Something went wrong" });
});

module.exports = app;
