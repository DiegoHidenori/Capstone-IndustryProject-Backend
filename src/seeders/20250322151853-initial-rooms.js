"use strict";

/* @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const now = new Date();

        const rooms = [];

        rooms.push({
            roomName: "Main Kitchen",
            roomType: "Kitchen",
            roomPricePerNight: 0,
            roomDescription: "Fully equipped kitchen",
            maxCapacity: 140,
            needsCleaning: false,
            createdAt: now,
            updatedAt: now,
        });

        rooms.push({
            roomName: "Dining Room",
            roomType: "Dining",
            roomPricePerNight: 0,
            roomDescription: "Large dining room",
            maxCapacity: 140,
            needsCleaning: false,
            createdAt: now,
            updatedAt: now,
        });

        for (let i = 1; i <= 5; i++) {
            rooms.push({
                roomName: `Conference Room ${i}`,
                roomType: "Conference",
                roomPricePerNight: 150,
                roomDescription: `Conference room number ${i}`,
                maxCapacity: 5,
                needsCleaning: false,
                createdAt: now,
                updatedAt: now,
            });
        }

        rooms.push({
            roomName: "Chapel",
            roomType: "Chapel",
            roomPricePerNight: 0,
            roomDescription: "Quiet place for prayer and worship",
            maxCapacity: 120,
            needsCleaning: false,
            createdAt: now,
            updatedAt: now,
        });

        for (let i = 3; i <= 64; i++) {
            rooms.push({
                roomName: `Bedroom ${i}`,
                roomType: "Bedroom",
                roomPricePerNight: 80,
                roomDescription: `Room with bed #${i}`,
                maxCapacity: 2,
                needsCleaning: false,
                createdAt: now,
                updatedAt: now,
            });
        }

        await queryInterface.bulkInsert("Rooms", rooms, {});

        const insertedRooms = await queryInterface.sequelize.query(
            'SELECT * FROM "Rooms";', // Fetch inserted rows
            { type: Sequelize.QueryTypes.SELECT }
        );

        const kitchenRoom = insertedRooms.find((r) => r.roomType === "Kitchen");
        const diningRoom = insertedRooms.find((r) => r.roomType === "Dining");
        const chapelRoom = insertedRooms.find((r) => r.roomType === "Chapel");
        const conferenceRooms = insertedRooms.filter(
            (r) => r.roomType === "Conference"
        );
        const bedroomRooms = insertedRooms.filter(
            (r) => r.roomType === "Bedroom"
        );

        if (kitchenRoom) {
            await queryInterface.bulkInsert("Kitchens", [
                {
                    roomId: kitchenRoom.roomId,
                    createdAt: now,
                    updatedAt: now,
                },
            ]);
        }

        if (diningRoom) {
            await queryInterface.bulkInsert("DiningRooms", [
                {
                    roomId: diningRoom.roomId,
                    createdAt: now,
                    updatedAt: now,
                },
            ]);
        }

        if (conferenceRooms.length > 0) {
            await queryInterface.bulkInsert(
                "ConferenceRooms",
                conferenceRooms.map((room, index) => ({
                    roomId: room.roomId,
                    seatingPlan: "Classroom",
                    numChairs: 40 + index * 5,
                    numTables: 10 + index,
                    createdAt: now,
                    updatedAt: now,
                }))
            );
        }

        if (chapelRoom) {
            await queryInterface.bulkInsert("Chapels", [
                {
                    roomId: chapelRoom.roomId,
                    createdAt: now,
                    updatedAt: now,
                },
            ]);
        }

        if (bedroomRooms.length > 0) {
            await queryInterface.bulkInsert(
                "Bedrooms",
                bedroomRooms.map((room) => {
                    const roomNumber = parseInt(room.roomName.split(" ")[1]);
                    return {
                        roomId: room.roomId,
                        bedroomNumber: roomNumber,
                        hasShower: roomNumber >= 30,
                        createdAt: now,
                        updatedAt: now,
                    };
                })
            );
        }
    },

    async down(queryInterface, Sequelize) {
        await Promise.all([
            queryInterface.bulkDelete("Kitchens", null, {
                truncate: true,
                cascade: true,
            }),
            queryInterface.bulkDelete("DiningRooms", null, {
                truncate: true,
                cascade: true,
            }),
            queryInterface.bulkDelete("ConferenceRooms", null, {
                truncate: true,
                cascade: true,
            }),
            queryInterface.bulkDelete("Chapels", null, {
                truncate: true,
                cascade: true,
            }),
            queryInterface.bulkDelete("Bedrooms", null, {
                truncate: true,
                cascade: true,
            }),
            queryInterface.bulkDelete("Rooms", null, {
                truncate: true,
                cascade: true,
            }),
        ]);
    },
};
