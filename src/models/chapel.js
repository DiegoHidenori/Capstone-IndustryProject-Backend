"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Chapel extends Model {
        static associate(models) {
            Chapel.belongsTo(models.Room, {
                foreignKey: "roomId",
                onDelete: "CASCADE",
            });
        }
    }

    Chapel.init(
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
            modelName: "Chapel",
        }
    );

    return Chapel;
};
