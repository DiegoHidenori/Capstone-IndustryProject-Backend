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
            bedroomNumber: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            hasShower: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: "Bedroom",
        }
    );

    return Bedroom;
};
