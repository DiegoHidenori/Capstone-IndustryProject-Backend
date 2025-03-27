const bcrypt = require("bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const now = new Date();
        const hashedPassword = await bcrypt.hash("AdminPassword123", 10);

        await queryInterface.bulkInsert("Users", [
            {
                firstName: "System",
                lastName: "Admin",
                email: "admin@qoa.com",
                password: hashedPassword,
                role: "admin",
                createdAt: now,
                updatedAt: now,
            },
        ]);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("Users", { email: "admin@qoa.com" });
    },
};
