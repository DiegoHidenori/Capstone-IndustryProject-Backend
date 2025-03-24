"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("BookingDiscounts", {
            bookingId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "Bookings",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            discountId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "Discounts",
                    key: "id",
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

        await queryInterface.addConstraint("BookingDiscounts", {
            fields: ["bookingId", "discountId"],
            type: "primary key",
            name: "booking_discount_pkey",
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("BookingDiscounts");
    },
};
