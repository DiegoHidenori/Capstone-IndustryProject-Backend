"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Bedroom extends Model {
        static associate(models) {
            Bedroom.belongsTo(models.Room, {
                foreignKey: "roomId",
                onDelete: "CASCADE",
            });
        }
    }

    Bedroom.init(
        {
            roomId: DataTypes.INTEGER,
            bedroomNumber: DataTypes.INTEGER,
            hasShower: DataTypes.BOOLEAN,
        },
        {
            sequelize,
            modelName: "Bedroom",
        }
    );

    return Bedroom;
};
