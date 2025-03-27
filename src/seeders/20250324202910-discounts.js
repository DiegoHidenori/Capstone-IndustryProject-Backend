"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert("Discounts", [
            {
                name: "Director's Discount",
                description: "Discount for long-time customers.",
                discountType: "fixed",
                discountValue: 50,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("Discounts", null, {});
    },
};
