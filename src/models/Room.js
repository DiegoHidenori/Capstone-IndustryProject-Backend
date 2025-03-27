"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Room extends Model {
        static associate(models) {
            // Joined inheritance relationships
            Room.hasOne(models.ConferenceRoom, { foreignKey: "roomId" });
            Room.hasOne(models.Bedroom, { foreignKey: "roomId" });
            Room.hasOne(models.DiningRoom, { foreignKey: "roomId" });
            Room.hasOne(models.Chapel, { foreignKey: "roomId" });
            Room.hasOne(models.Kitchen, { foreignKey: "roomId" });

            // Many-to-Many with Booking
            Room.belongsToMany(models.Booking, {
                through: { model: "BookingRooms", schema: "public" },
                foreignKey: "roomId",
                otherKey: "bookingId",
            });
        }
    }

    Room.init(
        {
            roomId: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            roomName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            roomType: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            roomPricePerNight: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            roomDescription: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            maxCapacity: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            needsCleaning: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: "Room",
        }
    );

    return Room;
};
