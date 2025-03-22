const express = require("express");
const cors = require("cors");
require("express-async-errors");

const roomRoutes = require("./routes/roomRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/rooms", roomRoutes);
app.use("/auth", authRoutes);
app.use("/users", userRoutes);

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
