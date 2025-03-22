const bcrypt = require("bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        /**
         * Add seed commands here.
         *
         * Example:
         * await queryInterface.bulkInsert('People', [{
         *   name: 'John Doe',
         *   isBetaMember: false
         * }], {});
         */
        const hashedPassword = await bcrypt.hash("AdminPassword123", 10);

        await queryInterface.bulkInsert("Users", [
            {
                firstName: "System",
                lastName: "Admin",
                email: "admin@qoa.com",
                password: hashedPassword,
                role: "admin",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        await queryInterface.bulkDelete("Users", { email: "admin@qoa.com" });
    },
};
