"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Meal extends Model {
        static associate(models) {
            Meal.belongsToMany(models.Booking, {
                through: { model: "BookingMeals", schema: "public" },
                foreignKey: "mealId",
                otherKey: "bookingId",
            });
        }
    }
    Meal.init(
        {
            mealId: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            price: {
                type: DataTypes.DECIMAL,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: "Meal",
        }
    );
    return Meal;
};
