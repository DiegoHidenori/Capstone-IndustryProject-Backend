"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Invoice extends Model {
        static associate(models) {
            Invoice.belongsTo(models.Booking, {
                foreignKey: "bookingId",
                onDelete: "CASCADE",
            });
            Invoice.belongsTo(models.User, {
                foreignKey: "userId",
                onDelete: "CASCADE",
            });
            Invoice.hasMany(models.Payment, {
                foreignKey: "invoiceId",
                onDelete: "CASCADE",
            });
        }
    }

    Invoice.init(
        {
            invoiceId: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            bookingId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "Bookings",
                    key: "bookingId",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "Users",
                    key: "userId",
                },
            },
            totalAmount: {
                type: DataTypes.DECIMAL,
                allowNull: false,
            },
            depositAmount: {
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
