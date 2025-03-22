"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        /**
         * Add seed commands here.
         *
         * Example:
         * await queryInterface.bulkInsert('People', [{
         *   name: 'John Doe',
         *   isBetaMember: false
         * }], {});
         */
        const now = new Date();

        const rooms = [];

        rooms.push({
            roomName: "Main Kitchen",
            roomType: "Kitchen",
            pricePerNight: 0,
            description: "Fully equipped kitchen",
            maxCapacity: 140,
            needsCleaning: false,
            createdAt: now,
            updatedAt: now,
        });

        rooms.push({
            roomName: "Dining Room",
            roomType: "Dining",
            pricePerNight: 0,
            description: "Large dining room",
            maxCapacity: 140,
            needsCleaning: false,
            createdAt: now,
            updatedAt: now,
        });

        for (let i = 1; i <= 5; i++) {
            rooms.push({
                roomName: `Conference Room ${i}`,
                roomType: "Conference",
                pricePerNight: 150,
                description: `Conference room number ${i}`,
                maxCapacity: 5,
                needsCleaning: false,
                createdAt: now,
                updatedAt: now,
            });
        }

        rooms.push({
            roomName: "Chapel",
            roomType: "Chapel",
            pricePerNight: 0,
            description: "Quiet place for prayer and worship",
            maxCapacity: 120,
            needsCleaning: false,
            createdAt: now,
            updatedAt: now,
        });

        for (let i = 3; i <= 64; i++) {
            rooms.push({
                roomName: `Bedroom ${i}`,
                roomType: "Bedroom",
                pricePerNight: 80,
                description: `Room with bed #${i}`,
                maxCapacity: 2,
                needsCleaning: false,
                createdAt: now,
                updatedAt: now,
            });
        }

        const insertedRooms = await queryInterface.bulkInsert("Rooms", rooms, {
            returning: true,
        });

        const kitchenRoom = insertedRooms[0];
        const diningRoom = insertedRooms[1];
        const conferenceRooms = insertedRooms.slice(2, 7);
        const chapelRoom = insertedRooms[7];
        const bedroomRooms = insertedRooms.slice(8);

        await queryInterface.bulkInsert("Kitchens", [
            {
                roomId: kitchenRoom.id,
                createdAt: now,
                updatedAt: now,
            },
        ]);

        await queryInterface.bulkInsert("DiningRooms", [
            {
                roomId: diningRoom.id,
                createdAt: now,
                updatedAt: now,
            },
        ]);

        await queryInterface.bulkInsert(
            "ConferenceRooms",
            conferenceRooms.map((room, index) => ({
                roomId: room.id,
                seatingPlan: "Classroom",
                numChairs: 40 + index * 5,
                numTables: 10 + index,
                createdAt: now,
                updatedAt: now,
            }))
        );

        await queryInterface.bulkInsert("Chapels", [
            {
                roomId: chapelRoom.id,
                createdAt: now,
                updatedAt: now,
            },
        ]);

        await queryInterface.bulkInsert(
            "Bedrooms",
            bedroomRooms.map((room) => {
                const roomNumber = parseInt(room.roomName.split(" ")[1]);
                return {
                    roomId: room.id,
                    bedroomNumber: roomNumber,
                    hasShower: roomNumber >= 30,
                    createdAt: now,
                    updatedAt: now,
                };
            })
        );
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */

        await Promise.all([
            queryInterface.bulkDelete("Kitchens", null, {}),
            queryInterface.bulkDelete("DiningRooms", null, {}),
            queryInterface.bulkDelete("ConferenceRooms", null, {}),
            queryInterface.bulkDelete("Chapels", null, {}),
            queryInterface.bulkDelete("Bedrooms", null, {}),
            queryInterface.bulkDelete("Rooms", null, {}),
        ]);
    },
};
