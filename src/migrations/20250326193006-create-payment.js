"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("Payments", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            transactionId: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },
            invoiceId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "Invoices",
                    key: "invoiceId",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            amountPaid: {
                type: Sequelize.DECIMAL,
                allowNull: false,
            },
            paymentType: {
                type: Sequelize.ENUM("deposit", "final_payment"),
                allowNull: false,
            },
            status: {
                type: Sequelize.ENUM("pending", "successful", "failed"),
                allowNull: false,
                defaultValue: "pending",
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn("NOW"),
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("Payments");
    },
};
