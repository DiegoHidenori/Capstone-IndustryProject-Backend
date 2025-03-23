"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("Bookings", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            bookingDate: {
                type: Sequelize.DATE,
            },
            depositPaid: {
                type: Sequelize.BOOLEAN,
            },
            depositAmount: {
                type: Sequelize.DECIMAL,
            },
            depositPaymentId: {
                type: Sequelize.STRING,
            },
            bookingFullyPaid: {
                type: Sequelize.BOOLEAN,
            },
            fullPaymentInvoiceId: {
                type: Sequelize.STRING,
            },
            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "Users",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            hasOvernight: {
                type: Sequelize.BOOLEAN,
            },
            firstMeal: {
                type: Sequelize.ENUM("breakfast", "lunch", "dinner"),
                allowNull: true,
            },
            checkinDate: {
                type: Sequelize.DATE,
            },
            checkoutDate: {
                type: Sequelize.DATE,
            },
            bookingPrice: {
                type: Sequelize.DECIMAL,
            },
            requirements: {
                type: Sequelize.ARRAY(Sequelize.STRING), // or JSONB if preferred
                allowNull: true,
            },
            paymentStatus: {
                type: Sequelize.STRING,
            },
            staffNotes: {
                type: Sequelize.TEXT,
            },
            participantsList: {
                type: Sequelize.ARRAY(Sequelize.STRING),
                allowNull: true,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("Bookings");
    },
};
