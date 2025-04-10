const { Booking, Room, User, Meal, Discount, Invoice } = require("../models");
const { Op } = require("sequelize");
const sanitizePayload = require("../utils/sanitizePayload");
const validateBookingPayload = require("../utils/validateBookingPayload");

// Utility: Create invoice
async function createInvoice(bookingId, userId, totalAmount) {
	const depositAmount = totalAmount * 0.2;
	return await Invoice.create({
		bookingId,
		userId,
		totalAmount,
		depositAmount,
		status: "unpaid",
	});
}

// Utility: Calculate final price
async function calculateTotalPrice(bookingPrice, mealIds, discountIds) {
	let totalMealCost = 0;
	let totalDiscountAmount = 0;

	if (mealIds?.length) {
		const meals = await Meal.findAll({ where: { mealId: mealIds } });
		totalMealCost = meals.reduce(
			(sum, meal) => sum + parseFloat(meal.price),
			0
		);
	}

	if (discountIds?.length) {
		const discounts = await Discount.findAll({
			where: { discountId: discountIds },
		});

		for (const discount of discounts) {
			if (discount.discountType === "percentage") {
				totalDiscountAmount +=
					(parseFloat(bookingPrice) + totalMealCost) *
					(parseFloat(discount.discountValue) / 100);
			} else if (discount.discountType === "fixed") {
				totalDiscountAmount += parseFloat(discount.discountValue);
			}
		}
	}

	const finalPrice =
		parseFloat(bookingPrice) + totalMealCost - totalDiscountAmount;
	return Math.max(finalPrice, 0);
}

module.exports = {
	createBooking: async (req, res) => {
		try {
			const allowedFields = [
				"userId",
				"hasOvernight",
				"firstMeal",
				"checkinDate",
				"checkoutDate",
				"bookingPrice",
				"requirements",
				"staffNotes",
				"participantsList",
				"roomIds",
				"mealIds",
				"discountIds",
			];

			const payload = sanitizePayload(req.body, allowedFields);
			const errors = validateBookingPayload(payload);
			if (errors.length > 0) {
				return res.status(400).json({ errors });
			}

			const {
				userId,
				hasOvernight,
				firstMeal,
				checkinDate,
				checkoutDate,
				bookingPrice,
				requirements,
				staffNotes,
				participantsList,
				roomIds,
				mealIds,
				discountIds,
			} = payload;

			const user = await User.findByPk(userId);
			if (!user)
				return res.status(400).json({ message: "User does not exist" });

			if (roomIds?.length) {
				const rooms = await Room.findAll({
					where: { roomId: roomIds },
				});
				if (rooms.length !== roomIds.length) {
					return res.status(400).json({
						message: "One or more room IDs are invalid",
						validRoomIds: rooms.map((r) => r.roomId),
					});
				}

				const conflicts = await Booking.findAll({
					include: [{ model: Room, where: { roomId: roomIds } }],
					where: {
						[Op.or]: [
							{
								checkinDate: {
									[Op.between]: [checkinDate, checkoutDate],
								},
							},
							{
								checkoutDate: {
									[Op.between]: [checkinDate, checkoutDate],
								},
							},
							{
								checkinDate: { [Op.lte]: checkinDate },
								checkoutDate: { [Op.gte]: checkoutDate },
							},
						],
					},
				});

				if (conflicts.length > 0) {
					const conflictRoomIds = [
						...new Set(
							conflicts.flatMap((b) =>
								b.Rooms.map((room) => room.roomId)
							)
						),
					];
					return res.status(409).json({
						message:
							"One or more selected rooms are already booked for the selected dates.",
						conflictingRoomIds,
					});
				}
			}

			const finalPrice = await calculateTotalPrice(
				bookingPrice,
				mealIds,
				discountIds
			);

			const booking = await Booking.create({
				userId,
				bookingDate: new Date(),
				hasOvernight,
				firstMeal,
				checkinDate,
				checkoutDate,
				bookingPrice: finalPrice,
				requirements,
				staffNotes,
				participantsList,
			});

			if (roomIds?.length) await booking.setRooms(roomIds);
			if (mealIds?.length) await booking.setMeals(mealIds);
			if (discountIds?.length) await booking.setDiscounts(discountIds);

			await createInvoice(booking.bookingId, user.userId, finalPrice);

			const fullBooking = await Booking.findByPk(booking.bookingId, {
				include: [Room, User, Meal, Discount, Invoice],
			});

			res.status(201).json(fullBooking);
		} catch (err) {
			console.error(`[BookingController] CREATE error:`, err);
			res.status(500).json({
				message: "Error creating booking",
				error: err,
			});
		}
	},

	getAllBookings: async (req, res) => {
		try {
			const bookings = await Booking.findAll({
				include: [Room, User, Meal, Discount, Invoice],
			});
			res.json(bookings);
		} catch (err) {
			console.error(`[BookingController] GET ALL error:`, err);
			res.status(500).json({
				message: "Error fetching bookings",
				error: err,
			});
		}
	},

	getBookingById: async (req, res) => {
		try {
			const booking = await Booking.findByPk(req.params.bookingId, {
				include: [Room, User, Meal, Discount, Invoice],
			});

			if (!booking) {
				return res.status(404).json({ message: "Booking not found" });
			}

			let discountBreakdown = [];
			let totalDiscountAmount = 0;

			for (const discount of booking.Discounts) {
				let discountAmount = 0;
				if (discount.discountType === "percentage") {
					const subtotal =
						parseFloat(booking.bookingPrice) +
						booking.Meals.reduce(
							(sum, meal) => sum + parseFloat(meal.price),
							0
						);

					discountAmount =
						subtotal * (parseFloat(discount.discountValue) / 100);
				} else if (discount.discountType === "fixed") {
					discountAmount = parseFloat(discount.discountValue);
				}
				totalDiscountAmount += discountAmount;

				discountBreakdown.push({
					discountName: discount.name,
					type: discount.discountType,
					value: discount.discountValue,
					discountAmount: discountAmount.toFixed(2),
				});
			}

			res.json({
				id: booking.bookingId,
				bookingDate: booking.bookingDate,
				checkinDate: booking.checkinDate,
				checkoutDate: booking.checkoutDate,
				firstMeal: booking.firstMeal,
				hasOvernight: booking.hasOvernight,
				staffNotes: booking.staffNotes,
				requirements: booking.requirements,
				participantsList: booking.participantsList,
				finalPrice: parseFloat(booking.bookingPrice).toFixed(2),
				discountBreakdown,
				totalDiscountAmount: totalDiscountAmount.toFixed(2),
				Rooms: booking.Rooms,
				Meals: booking.Meals,
				Discounts: booking.Discounts,
				Invoice: booking.Invoice,
				User: booking.User,
			});
		} catch (err) {
			console.error(`[BookingController] GET BY ID error:`, err);
			res.status(500).json({
				message: "Error fetching booking",
				error: err,
			});
		}
	},

	updateBooking: async (req, res) => {
		try {
			const allowedFields = [
				"hasOvernight",
				"firstMeal",
				"checkinDate",
				"checkoutDate",
				"bookingPrice",
				"requirements",
				"staffNotes",
				"participantsList",
				"roomIds",
				"mealIds",
				"discountIds",
			];

			const payload = sanitizePayload(req.body, allowedFields);
			const errors = validateBookingPayload(payload);
			if (errors.length > 0) {
				return res.status(400).json({ errors });
			}

			const {
				hasOvernight,
				firstMeal,
				checkinDate,
				checkoutDate,
				bookingPrice,
				requirements,
				staffNotes,
				participantsList,
				roomIds,
				mealIds,
				discountIds,
			} = payload;

			const booking = await Booking.findByPk(req.params.bookingId, {
				include: [Invoice],
			});
			if (!booking)
				return res.status(404).json({ message: "Booking not found" });

			if (roomIds?.length) {
				const rooms = await Room.findAll({
					where: { roomId: roomIds },
				});
				if (rooms.length !== roomIds.length) {
					return res.status(400).json({
						message: "One or more room IDs are invalid",
						validRoomIds: rooms.map((r) => r.roomId),
					});
				}

				const conflicts = await Booking.findAll({
					include: [{ model: Room, where: { roomId: roomIds } }],
					where: {
						bookingId: { [Op.ne]: booking.bookingId },
						[Op.or]: [
							{
								checkinDate: {
									[Op.between]: [checkinDate, checkoutDate],
								},
							},
							{
								checkoutDate: {
									[Op.between]: [checkinDate, checkoutDate],
								},
							},
							{
								checkinDate: { [Op.lte]: checkinDate },
								checkoutDate: { [Op.gte]: checkoutDate },
							},
						],
					},
				});

				if (conflicts.length > 0) {
					const conflictRoomIds = [
						...new Set(
							conflicts.flatMap((b) =>
								b.Rooms.map((room) => room.roomId)
							)
						),
					];
					return res.status(409).json({
						message:
							"One or more selected rooms are already booked for the selected dates.",
						conflictingRoomIds,
					});
				}
			}

			const finalPrice = await calculateTotalPrice(
				bookingPrice,
				mealIds,
				discountIds
			);

			await booking.update({
				...payload,
				bookingPrice: finalPrice,
			});

			if (roomIds?.length) await booking.setRooms(roomIds);
			if (mealIds?.length) await booking.setMeals(mealIds);
			if (discountIds?.length) await booking.setDiscounts(discountIds);

			if (booking.Invoice) {
				await booking.Invoice.update({
					totalAmount: finalPrice,
					depositAmount: finalPrice * 0.2,
				});
			}

			const updatedBooking = await Booking.findByPk(booking.bookingId, {
				include: [Room, User, Meal, Discount, Invoice],
			});

			res.json(updatedBooking);
		} catch (err) {
			console.error(`[BookingController] UPDATE error:`, err);
			res.status(500).json({
				message: "Error updating booking",
				error: err,
			});
		}
	},

	deleteBooking: async (req, res) => {
		try {
			const booking = await Booking.findByPk(req.params.bookingId);
			if (!booking)
				return res.status(404).json({ message: "Booking not found" });

			await booking.destroy();
			res.json({ message: "Booking deleted" });
		} catch (err) {
			console.error(`[BookingController] DELETE error:`, err);
			res.status(500).json({
				message: "Error deleting booking",
				error: err,
			});
		}
	},
};
