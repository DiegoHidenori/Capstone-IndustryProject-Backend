"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Discount extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Discount.belongsToMany(models.Booking, {
                through: "BookingDiscounts",
                foreignKey: "discountId",
                otherKey: "bookingId",
            });
        }
    }
    Discount.init(
        {
            name: DataTypes.STRING,
            description: DataTypes.TEXT,
            type: {
                type: DataTypes.ENUM("percentage", "fixed"),
                allowNull: false,
            },
            value: DataTypes.DECIMAL,
        },
        {
            sequelize,
            modelName: "Discount",
        }
    );
    return Discount;
};
