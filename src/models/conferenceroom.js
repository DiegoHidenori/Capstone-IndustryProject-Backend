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
            roomId: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.INTEGER,
                references: {
                    model: "Rooms",
                    key: "roomId",
                },
                onDelete: "CASCADE",
            },
            seatingPlan: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            numChairs: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            numTables: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: "ConferenceRoom",
        }
    );

    return ConferenceRoom;
};
