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

            Booking.belongsToMany(models.Discount, {
                through: "BookingDiscounts",
                foreignKey: "bookingId",
                otherKey: "discountId",
            });

            Booking.hasMany(models.Payment, { foreignKey: "bookingId" });
            Booking.hasOne(models.Invoice, { foreignKey: "bookingId" });
        }
    }

    Booking.init(
        {
            bookingDate: DataTypes.DATE,
            depositAmount: {
                type: DataTypes.DECIMAL,
                allowNull: false,
            },
            depositPaid: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            depositPaymentId: DataTypes.STRING,
            finalPaymentId: DataTypes.STRING,
            bookingFullyPaid: DataTypes.BOOLEAN,
            userId: DataTypes.INTEGER,
            hasOvernight: DataTypes.BOOLEAN,
            firstMeal: DataTypes.STRING,
            checkinDate: DataTypes.DATE,
            checkoutDate: DataTypes.DATE,
            bookingPrice: DataTypes.DECIMAL,
            requirements: DataTypes.ARRAY(DataTypes.STRING),
            paymentStatus: {
                type: DataTypes.ENUM("pending", "deposit_paid", "fully_paid"),
                allowNull: false,
                defaultValue: "pending",
            },
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
