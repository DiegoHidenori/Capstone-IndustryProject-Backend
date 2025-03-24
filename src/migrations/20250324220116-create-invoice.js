"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("Invoices", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
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
            totalAmount: {
                type: Sequelize.DECIMAL,
                allowNull: false,
            },
            depositRequired: {
                type: Sequelize.DECIMAL,
                allowNull: false,
            },
            status: {
                type: Sequelize.ENUM("unpaid", "deposit_paid", "fully_paid"),
                allowNull: false,
                defaultValue: "unpaid",
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
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("Invoices");
    },
};
