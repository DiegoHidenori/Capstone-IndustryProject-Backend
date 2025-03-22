require("dotenv").config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    logging: false, // Set to true if you want SQL logs
    dialectOptions: {
        ssl:
            process.env.NODE_ENV === "production"
                ? { rejectUnauthorized: false }
                : false,
    },
});

sequelize
    .authenticate()
    .then(() => console.log("Connected to PostgreSQL via Sequelize"))
    .catch((err) => console.error("Sequelize connection error:", err));

module.exports = sequelize;

// This will manage PostgreSQL connections efficiently.
