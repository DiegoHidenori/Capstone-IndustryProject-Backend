"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        const now = new Date();
        await queryInterface.bulkInsert("Meals", [
            {
                name: "breakfast",
                price: 15.0,
                createdAt: now,
                updatedAt: now,
            },
            {
                name: "lunch",
                price: 25.0,
                createdAt: now,
                updatedAt: now,
            },
            {
                name: "dinner",
                price: 30.0,
                createdAt: now,
                updatedAt: now,
            },
        ]);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("Meals", null, {});
    },
};
