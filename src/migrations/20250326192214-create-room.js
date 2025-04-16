"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("Rooms", {
			roomId: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			roomName: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			roomType: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			roomPricePerNight: {
				type: Sequelize.INTEGER,
				allowNull: true,
			},
			roomDescription: {
				type: Sequelize.TEXT,
				allowNull: true,
			},
			maxCapacity: {
				type: Sequelize.INTEGER,
				allowNull: true,
			},
			needsCleaning: {
				type: Sequelize.BOOLEAN,
				allowNull: true,
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("Rooms");
	},
};
