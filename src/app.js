const express = require("express");
const cors = require("cors");
require("express-async-errors");
const pool = require("./config/database");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

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
