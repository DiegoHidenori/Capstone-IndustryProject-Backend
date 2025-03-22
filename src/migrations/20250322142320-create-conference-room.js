"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("ConferenceRooms", {
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
            seatingPlan: {
                type: Sequelize.STRING,
            },
            numChairs: {
                type: Sequelize.INTEGER,
            },
            numTables: {
                type: Sequelize.INTEGER,
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
