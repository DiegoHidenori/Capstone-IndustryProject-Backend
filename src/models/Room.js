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
                through: "BookingRooms",
                foreignKey: "roomId",
                otherKey: "bookingId",
            });
        }
    }

    Room.init(
        {
            roomName: DataTypes.STRING,
            roomType: DataTypes.STRING,
            pricePerNight: DataTypes.INTEGER,
            description: DataTypes.TEXT,
            maxCapacity: DataTypes.INTEGER,
            needsCleaning: DataTypes.BOOLEAN,
        },
        {
            sequelize,
            modelName: "Room",
        }
    );

    return Room;
};
