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
            roomId: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "DiningRoom",
        }
    );

    return DiningRoom;
};
