require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:
        process.env.NODE_ENV === "production"
            ? { rejectUnauthorized: false }
            : false,
});

pool.on("connect", () => {
    console.log("Connected to PostgreSQL Database");
});

pool.query("SELECT NOW()", (err, res) => {
    if (err) {
        console.error("Database connection error:", err);
    } else {
        console.log("Database connected at:", res.rows[0].now);
    }
});

module.exports = pool;

// This will manage PostgreSQL connections efficiently.
