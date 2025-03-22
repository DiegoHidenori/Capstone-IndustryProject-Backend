"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("Bedrooms", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            roomId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "Rooms",
                    key: "id",
                },
                onDelete: "CASCADE",
            },
            bedroomNumber: {
                type: Sequelize.INTEGER,
            },
            hasShower: {
                type: Sequelize.BOOLEAN,
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
        await queryInterface.dropTable("Bedrooms");
    },
};
