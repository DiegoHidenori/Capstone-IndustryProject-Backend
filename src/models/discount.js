"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Discount extends Model {
        static associate(models) {
            Discount.belongsToMany(models.Booking, {
                through: { model: "BookingDiscounts", schema: "public" },
                foreignKey: "discountId",
                otherKey: "bookingId",
            });
        }
    }
    Discount.init(
        {
            discountId: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            discountType: {
                type: DataTypes.ENUM("percentage", "fixed"),
                allowNull: false,
            },
            discountValue: {
                type: DataTypes.DECIMAL,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "Discount",
        }
    );
    return Discount;
};
