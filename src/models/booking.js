"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Booking extends Model {
        static associate(models) {
            // Many-to-Many with Room
            Booking.belongsToMany(models.Room, {
                through: { model: "BookingRooms", schema: "public" },
                foreignKey: "bookingId",
                otherKey: "roomId",
            });

            // Booking belongs to User
            Booking.belongsTo(models.User, {
                foreignKey: "userId",
            });

            Booking.belongsToMany(models.Meal, {
                through: { model: "BookingMeals", schema: "public" }, // ✅ Explicitly set schema
                foreignKey: "bookingId",
                otherKey: "mealId",
            });

            Booking.belongsToMany(models.Discount, {
                through: { model: "BookingDiscounts", schema: "public" }, // ✅ Explicitly set schema
                foreignKey: "bookingId",
                otherKey: "discountId",
            });

            // ✅ Booking has One Invoice (Payments are linked to Invoices)
            Booking.hasOne(models.Invoice, {
                foreignKey: "bookingId",
                onDelete: "CASCADE",
            });
        }
    }

    Booking.init(
        {
            bookingId: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            bookingDate: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            hasOvernight: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
            },
            firstMeal: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            checkinDate: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            checkoutDate: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            bookingPrice: {
                type: DataTypes.DECIMAL,
                allowNull: true,
            }, // Invoice depends on this
            requirements: {
                type: DataTypes.ARRAY(DataTypes.STRING),
                allowNull: true,
            },
            staffNotes: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            participantsList: {
                type: DataTypes.ARRAY(DataTypes.STRING),
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: "Booking",
        }
    );

    return Booking;
};
