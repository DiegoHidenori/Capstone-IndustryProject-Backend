"use strict";

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.sequelize.query(`
			ALTER TABLE "Rooms"
			ADD CONSTRAINT "room_type_check"
			CHECK ("roomType" IN ('Bedroom', 'Conference', 'Dining', 'Kitchen', 'Chapel'));
		`);
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.sequelize.query(`
			ALTER TABLE "Rooms"
			DROP CONSTRAINT "room_type_check";
		`);
	},
};
