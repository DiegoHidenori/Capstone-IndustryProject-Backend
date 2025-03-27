require("dotenv").config();
// console.log("Loaded DB URL:", process.env.DATABASE_URL);

module.exports = {
    development: {
        url: process.env.DATABASE_URL,
        dialect: "postgres",
        // schema: "public",
    },
    test: {
        url: process.env.DATABASE_URL,
        dialect: "postgres",
    },
    production: {
        url: process.env.DATABASE_URL,
        dialect: "postgres",
    },
};
