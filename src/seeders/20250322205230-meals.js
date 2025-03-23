"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert("Meals", [
            {
                name: "breakfast",
                price: 15.0,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "lunch",
                price: 25.0,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "dinner",
                price: 30.0,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("Meals", null, {});
    },
};
