const {
	Room,
	Bedroom,
	ConferenceRoom,
	DiningRoom,
	Chapel,
	Kitchen,
} = require("../models");

function sanitizeDetails(details, allowedFields) {
	return Object.fromEntries(
		Object.entries(details).filter(([key]) => allowedFields.includes(key))
	);
}

module.exports = {
	getAllRooms: async (req, res) => {
		try {
			const rooms = await Room.findAll();
			res.json(rooms);
		} catch (error) {
			console.error(
				`[RoomController] ${req.method} ${req.originalUrl} Error:`,
				err
			);
			res.status(500).json({ error: "Failed to fetch rooms" });
		}
	},

	getRoomById: async (req, res) => {
		try {
			const { roomId } = req.params;
			const room = await Room.findByPk(roomId);
			if (!room)
				return res.status(404).json({ message: "Room not found" });

			const response = room.toJSON();

			switch (room.roomType) {
				case "Bedroom":
					response.details = await Bedroom.findOne({
						where: { roomId },
					});
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
				case "Kitchen":
					response.details = await Kitchen.findOne({
						where: { roomId },
					});
					break;
				case "Chapel":
					response.details = await Chapel.findOne({
						where: { roomId },
					});
					break;
				default:
					response.details = null;
			}

			res.json(response);
		} catch (error) {
			console.error(
				`[RoomController] ${req.method} ${req.originalUrl} Error:`,
				err
			);
			res.status(500).json({ message: "Failed to fetch room" });
		}
	},

	createRoom: async (req, res) => {
		const t = await Room.sequelize.transaction();

		try {
			const {
				roomName,
				roomType,
				roomPricePerNight,
				roomDescription,
				maxCapacity,
				needsCleaning,
				details = {},
			} = req.body;

			const newRoom = await Room.create(
				{
					roomName,
					roomType,
					roomPricePerNight,
					roomDescription,
					maxCapacity,
					needsCleaning,
				},
				{ transaction: t }
			);

			switch (roomType) {
				case "Bedroom":
					await Bedroom.create(
						{
							roomId: newRoom.roomId,
							...sanitizeDetails(details, [
								"bedroomNumber",
								"hasShower",
							]),
						},
						{ transaction: t }
					);
					break;
				case "Conference":
					await ConferenceRoom.create(
						{
							roomId: newRoom.roomId,
							...sanitizeDetails(details, [
								"seatingPlan",
								"numChairs",
								"numTables",
							]),
						},
						{ transaction: t }
					);
					break;
				case "Dining":
					await DiningRoom.create(
						{ roomId: newRoom.roomId },
						{ transaction: t }
					);
					break;
				case "Kitchen":
					await Kitchen.create(
						{ roomId: newRoom.roomId },
						{ transaction: t }
					);
					break;
				case "Chapel":
					await Chapel.create(
						{ roomId: newRoom.roomId },
						{ transaction: t }
					);
					break;
				default:
					throw new Error("Invalid room type");
			}

			await t.commit();
			res.status(201).json({
				message: "Room created successfully",
				roomId: newRoom.roomId,
			});
		} catch (error) {
			await t.rollback();
			console.error(
				`[RoomController] ${req.method} ${req.originalUrl} Error:`,
				err
			);
			res.status(500).json({ message: "Failed to create room" });
		}
	},

	editRoom: async (req, res) => {
		const { roomId } = req.params;
		const t = await Room.sequelize.transaction();

		try {
			const {
				roomName,
				roomPricePerNight,
				roomDescription,
				maxCapacity,
				needsCleaning,
				details = {},
			} = req.body;

			const room = await Room.findByPk(roomId);
			if (!room)
				return res.status(404).json({ message: "Room not found" });

			await room.update(
				{
					roomName,
					roomPricePerNight,
					roomDescription,
					maxCapacity,
					needsCleaning,
				},
				{ transaction: t }
			);

			switch (roomType) {
				case "Bedroom":
					await Bedroom.update(
						sanitizeDetails(details, [
							"bedroomNumber",
							"hasShower",
						]),
						{ where: { roomId }, transaction: t }
					);
					break;
				case "Conference":
					await ConferenceRoom.update(
						sanitizeDetails(details, [
							"seatingPlan",
							"numChairs",
							"numTables",
						]),
						{ where: { roomId }, transaction: t }
					);
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
			console.error(
				`[RoomController] ${req.method} ${req.originalUrl} Error:`,
				err
			);
			res.status(500).json({ message: "Failed to update room" });
		}
	},

	deleteRoom: async (req, res) => {
		const { roomId } = req.params;

		try {
			const room = await Room.findByPk(roomId);
			if (!room)
				return res.status(404).json({ message: "Room not found" });

			await room.destroy(); // ✅ Sequelize cascade works here
			res.json({ message: "Room deleted successfully" });
		} catch (error) {
			console.error(
				`[RoomController] ${req.method} ${req.originalUrl} Error:`,
				err
			);
			res.status(500).json({ message: "Failed to delete room" });
		}
	},
};
