"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Invoice extends Model {
        static associate(models) {
            Invoice.belongsTo(models.Booking, { foreignKey: "bookingId" });
        }
    }

    Invoice.init(
        {
            bookingId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "Bookings",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            totalAmount: {
                type: DataTypes.DECIMAL,
                allowNull: false,
            },
            depositRequired: {
                type: DataTypes.DECIMAL,
                allowNull: false,
            },
            status: {
                type: DataTypes.ENUM("unpaid", "deposit_paid", "fully_paid"),
                allowNull: false,
                defaultValue: "unpaid",
            },
        },
        {
            sequelize,
            modelName: "Invoice",
        }
    );

    return Invoice;
};
