const express = require("express");
const router = express.Router();
const {
    Room,
    Bedroom,
    ConferenceRoom,
    DiningRoom,
    Chapel,
    Kitchen,
} = require("../models");
const {
    authenticateUser,
    authorizeRoles,
} = require("../middleware/authMiddleware");

router.get("/", async (req, res) => {
    try {
        const rooms = await Room.findAll();
        res.json(rooms);
    } catch (error) {
        console.error("Error fetching rooms:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const roomId = req.params.id;

        // Get the base room first
        const room = await Room.findByPk(roomId);

        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        // Prepare response with base room data
        const response = room.toJSON();

        // Dynamically include specialized room data
        switch (room.roomType) {
            case "Bedroom":
                response.details = await Bedroom.findOne({ where: { roomId } });
                break;
            case "Conference":
                response.details = await ConferenceRoom.findOne({
                    where: { roomId },
                });
                break;
            case "Dining":
                response.details = await DiningRoom.findOne({
                    where: { roomId },
                });
                break;
            case "Chapel":
                response.details = await Chapel.findOne({ where: { roomId } });
                break;
            case "Kitchen":
                response.details = await Kitchen.findOne({ where: { roomId } });
                break;
            default:
                response.details = null;
        }

        res.json(response);
    } catch (error) {
        console.error("Error fetching room with details:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
});

router.post(
    "/",
    authenticateUser,
    authorizeRoles("admin", "staff"),
    async (req, res) => {
        const {
            roomName,
            roomType,
            pricePerNight,
            description,
            maxCapacity,
            needsCleaning,
            details, // holds type-specific fields
        } = req.body;

        const t = await Room.sequelize.transaction();

        try {
            // 1. Create the base Room
            const newRoom = await Room.create(
                {
                    roomName,
                    roomType,
                    pricePerNight,
                    description,
                    maxCapacity,
                    needsCleaning,
                },
                { transaction: t }
            );

            // 2. Based on roomType, insert into the appropriate specialized table
            switch (roomType) {
                case "Bedroom":
                    await Bedroom.create(
                        {
                            roomId: newRoom.id,
                            bedroomNumber: details.bedroomNumber,
                            hasShower: details.hasShower,
                        },
                        { transaction: t }
                    );
                    break;

                case "Conference":
                    await ConferenceRoom.create(
                        {
                            roomId: newRoom.id,
                            seatingPlan: details.seatingPlan,
                            numChairs: details.numChairs,
                            numTables: details.numTables,
                        },
                        { transaction: t }
                    );
                    break;

                case "Dining":
                    await DiningRoom.create(
                        { roomId: newRoom.id },
                        { transaction: t }
                    );
                    break;

                case "Kitchen":
                    await Kitchen.create(
                        { roomId: newRoom.id },
                        { transaction: t }
                    );
                    break;

                case "Chapel":
                    await Chapel.create(
                        { roomId: newRoom.id },
                        { transaction: t }
                    );
                    break;

                default:
                    throw new Error("Invalid room type");
            }

            await t.commit();

            res.status(201).json({
                message: "Room created successfully",
                roomId: newRoom.id,
            });
        } catch (error) {
            await t.rollback();
            console.error("Error creating room:", error);
            res.status(500).json({ message: "Failed to create room" });
        }
    }
);

// PUT /rooms/:id - Update a room and its specialized data
router.put(
    "/:id",
    authenticateUser,
    authorizeRoles("admin", "staff"),
    async (req, res) => {
        const roomId = req.params.id;
        const {
            roomName,
            roomType,
            pricePerNight,
            description,
            maxCapacity,
            needsCleaning,
            details, // updated type-specific data
        } = req.body;

        const t = await Room.sequelize.transaction();

        try {
            // 1. Update the base Room
            const room = await Room.findByPk(roomId);
            if (!room) {
                return res.status(404).json({ message: "Room not found" });
            }

            await room.update(
                {
                    roomName,
                    roomType,
                    pricePerNight,
                    description,
                    maxCapacity,
                    needsCleaning,
                },
                { transaction: t }
            );

            // 2. Update the type-specific table
            switch (roomType) {
                case "Bedroom":
                    await Bedroom.update(details, {
                        where: { roomId },
                        transaction: t,
                    });
                    break;

                case "Conference":
                    await ConferenceRoom.update(details, {
                        where: { roomId },
                        transaction: t,
                    });
                    break;

                case "Dining":
                    await DiningRoom.update(
                        {},
                        { where: { roomId }, transaction: t }
                    );
                    break;

                case "Kitchen":
                    await Kitchen.update(
                        {},
                        { where: { roomId }, transaction: t }
                    );
                    break;

                case "Chapel":
                    await Chapel.update(
                        {},
                        { where: { roomId }, transaction: t }
                    );
                    break;

                default:
                    throw new Error("Invalid room type");
            }

            await t.commit();

            res.json({ message: "Room updated successfully" });
        } catch (error) {
            await t.rollback();
            console.error("Error updating room:", error);
            res.status(500).json({ message: "Failed to update room" });
        }
    }
);

// DELETE /rooms/:id - Delete a room and its specialized data
router.delete(
    "/:id",
    authenticateUser,
    authorizeRoles("admin", "staff"),
    async (req, res) => {
        const roomId = req.params.id;

        try {
            const room = await Room.findByPk(roomId);
            if (!room) {
                return res.status(404).json({ message: "Room not found" });
            }

            await room.destroy(); // Cascade will clean up the specialized room type

            res.json({ message: "Room deleted successfully" });
        } catch (error) {
            console.error("Error deleting room:", error);
            res.status(500).json({ message: "Failed to delete room" });
        }
    }
);

module.exports = router;
