"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Payment extends Model {
        static associate(models) {
            Payment.belongsTo(models.Invoice, {
                foreignKey: "invoiceId",
                onDelete: "CASCADE",
            });
        }
    }

    Payment.init(
        {
            transactionId: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            invoiceId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "Invoices",
                    key: "invoiceId",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            amountPaid: {
                type: DataTypes.DECIMAL,
                allowNull: false,
            },
            paymentType: {
                type: DataTypes.ENUM("deposit", "final_payment"),
                allowNull: false,
            },
            status: {
                type: DataTypes.ENUM("pending", "successful", "failed"),
                allowNull: false,
                defaultValue: "pending",
            },
        },
        {
            sequelize,
            modelName: "Payment",
        }
    );

    return Payment;
};
