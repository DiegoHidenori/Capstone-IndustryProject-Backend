"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("BookingRooms", {
            bookingId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "Bookings",
                    key: "bookingId",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            roomId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "Rooms",
                    key: "roomId",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn("NOW"),
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn("NOW"),
            },
        });

        // Optional: Add composite primary key
        await queryInterface.addConstraint("BookingRooms", {
            fields: ["bookingId", "roomId"],
            type: "primary key",
            name: "booking_room_pkey",
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("BookingRooms");
    },
};
