"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Meal extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Meal.belongsToMany(models.Booking, {
                through: "BookingMeals",
                foreignKey: "mealId",
                otherKey: "bookingId",
            });
        }
    }
    Meal.init(
        {
            name: DataTypes.STRING,
            price: DataTypes.DECIMAL,
        },
        {
            sequelize,
            modelName: "Meal",
        }
    );
    return Meal;
};
