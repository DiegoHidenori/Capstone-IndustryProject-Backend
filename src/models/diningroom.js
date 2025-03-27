"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class DiningRoom extends Model {
        static associate(models) {
            DiningRoom.belongsTo(models.Room, {
                foreignKey: "roomId",
                onDelete: "CASCADE",
            });
        }
    }

    DiningRoom.init(
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
        },
        {
            sequelize,
            modelName: "DiningRoom",
        }
    );

    return DiningRoom;
};
