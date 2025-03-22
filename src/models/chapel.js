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
            roomId: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "Chapel",
        }
    );

    return Chapel;
};
