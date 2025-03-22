"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class ConferenceRoom extends Model {
        static associate(models) {
            ConferenceRoom.belongsTo(models.Room, {
                foreignKey: "roomId",
                onDelete: "CASCADE",
            });
        }
    }

    ConferenceRoom.init(
        {
            roomId: DataTypes.INTEGER,
            seatingPlan: DataTypes.STRING,
            numChairs: DataTypes.INTEGER,
            numTables: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "ConferenceRoom",
        }
    );

    return ConferenceRoom;
};
