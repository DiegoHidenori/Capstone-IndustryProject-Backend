"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("BookingMeals", {
            bookingId: {
                type: Sequelize.INTEGER,
                references: {
                    model: "Bookings",
                    key: "bookingId",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            mealId: {
                type: Sequelize.INTEGER,
                references: {
                    model: "Meals",
                    key: "mealId",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn("NOW"),
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn("NOW"),
            },
        });

        // Composite primary key
        await queryInterface.addConstraint("BookingMeals", {
            fields: ["bookingId", "mealId"],
            type: "primary key",
            name: "booking_meal_pkey",
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("BookingMeals");
    },
};
