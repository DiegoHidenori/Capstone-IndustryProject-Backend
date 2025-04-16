"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn("Payments", "updatedAt", {
			allowNull: false,
			type: Sequelize.DATE,
			defaultValue: Sequelize.fn("NOW"),
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.removeColumn("Payments", "updatedAt");
	},
};
