"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Kitchen extends Model {
        static associate(models) {
            Kitchen.belongsTo(models.Room, {
                foreignKey: "roomId",
                onDelete: "CASCADE",
            });
        }
    }

    Kitchen.init(
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
            modelName: "Kitchen",
        }
    );

    return Kitchen;
};
