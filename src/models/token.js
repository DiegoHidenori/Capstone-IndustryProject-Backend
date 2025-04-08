"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class Token extends Model {
		static associate(models) {
			Token.belongsTo(models.User, {
				foreignKey: "userId",
				onDelete: "CASCADE",
			});
		}
	}

	Token.init(
		{
			userId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			token: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
			expiresAt: {
				type: DataTypes.DATE,
				allowNull: false,
			},
		},
		{
			sequelize,
			modelName: "Token",
		}
	);

	return Token;
};
