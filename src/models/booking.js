"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Booking extends Model {
        static associate(models) {
            // Many-to-Many with Room
            Booking.belongsToMany(models.Room, {
                through: "BookingRooms",
                foreignKey: "bookingId",
                otherKey: "roomId",
            });

            // Booking belongs to User
            Booking.belongsTo(models.User, {
                foreignKey: "userId",
            });

            Booking.belongsToMany(models.Meal, {
                through: "BookingMeals",
                foreignKey: "bookingId",
                otherKey: "mealId",
            });
        }
    }

    Booking.init(
        {
            bookingDate: DataTypes.DATE,
            depositPaid: DataTypes.BOOLEAN,
            depositAmount: DataTypes.DECIMAL,
            depositPaymentId: DataTypes.STRING,
            bookingFullyPaid: DataTypes.BOOLEAN,
            fullPaymentInvoiceId: DataTypes.STRING,
            userId: DataTypes.INTEGER,
            hasOvernight: DataTypes.BOOLEAN,
            firstMeal: DataTypes.STRING,
            checkinDate: DataTypes.DATE,
            checkoutDate: DataTypes.DATE,
            bookingPrice: DataTypes.DECIMAL,
            requirements: DataTypes.ARRAY(DataTypes.STRING),
            paymentStatus: DataTypes.STRING,
            staffNotes: DataTypes.TEXT,
            participantsList: DataTypes.ARRAY(DataTypes.STRING),
        },
        {
            sequelize,
            modelName: "Booking",
        }
    );

    return Booking;
};
