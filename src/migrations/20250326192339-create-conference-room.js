"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("ConferenceRooms", {
            roomId: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                allowNull: false,
                references: {
                    model: "Rooms",
                    key: "roomId",
                },
                onDelete: "CASCADE",
            },
            seatingPlan: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            numChairs: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            numTables: {
                type: Sequelize.INTEGER,
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
        await queryInterface.dropTable("ConferenceRooms");
    },
};
