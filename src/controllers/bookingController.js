const { Booking, Room, User, Meal } = require("../models");

module.exports = {
    // Create a new booking
    createBooking: async (req, res) => {
        try {
            const {
                userId,
                bookingDate,
                depositPaid,
                depositAmount,
                depositPaymentId,
                bookingFullyPaid,
                fullPaymentInvoiceId,
                hasOvernight,
                firstMeal,
                checkinDate,
                checkoutDate,
                bookingPrice,
                requirements,
                paymentStatus,
                staffNotes,
                participantsList,
                roomIds, // ← Array of room IDs to associate
                mealIds,
            } = req.body;

            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(400).json({ message: "User does not exist" });
            }

            if (roomIds && roomIds.length > 0) {
                const rooms = await Room.findAll({ where: { id: roomIds } });
                if (rooms.length !== roomIds.length) {
                    return res.status(400).json({
                        message: "One or more room IDs are invalid",
                        validRoomIds: rooms.map((r) => r.id),
                    });
                }
            }

            let meals = [];
            let totalMealCost = 0;

            if (mealIds && mealIds.length > 0) {
                meals = await Meal.findAll({ where: { id: mealIds } });
                if (meals.length !== mealIds.length) {
                    return res.status(400).json({
                        message: "One or more meal IDs are invalid",
                        validMealIds: meals.map((m) => m.id),
                    });
                }

                // 💰 Calculate total meal cost
                totalMealCost = meals.reduce(
                    (sum, meal) => sum + parseFloat(meal.price),
                    0
                );
            }

            // 🧾 Final price = booking price + meal cost (optional)
            const totalPrice = parseFloat(bookingPrice) + totalMealCost;

            const booking = await Booking.create({
                userId,
                bookingDate,
                depositPaid,
                depositAmount,
                depositPaymentId,
                bookingFullyPaid,
                fullPaymentInvoiceId,
                hasOvernight,
                firstMeal,
                checkinDate,
                checkoutDate,
                bookingPrice: totalPrice,
                requirements,
                paymentStatus,
                staffNotes,
                participantsList,
            });

            if (roomIds && roomIds.length > 0) {
                await booking.setRooms(roomIds); // Many-to-many
            }

            if (mealIds && mealIds.length > 0) {
                await booking.setMeals(mealIds);
            }

            const fullBooking = await Booking.findByPk(booking.id, {
                include: [Room, User, Meal],
            });

            res.status(201).json(fullBooking);
        } catch (err) {
            console.error(err);
            res.status(500).json({
                message: "Error creating booking",
                error: err,
            });
        }
    },

    // Get all bookings
    getAllBookings: async (req, res) => {
        try {
            const bookings = await Booking.findAll({
                include: [Room, User, Meal],
            });
            res.json(bookings);
        } catch (err) {
            res.status(500).json({
                message: "Error fetching bookings",
                error: err,
            });
        }
    },

    // Get a single booking
    getBookingById: async (req, res) => {
        try {
            const booking = await Booking.findByPk(req.params.id, {
                include: [Room, User, Meal],
            });

            if (!booking)
                return res.status(404).json({ message: "Booking not found" });

            res.json(booking);
        } catch (err) {
            res.status(500).json({
                message: "Error fetching booking",
                error: err,
            });
        }
    },

    // Update a booking
    updateBooking: async (req, res) => {
        try {
            const {
                bookingDate,
                depositPaid,
                depositAmount,
                depositPaymentId,
                bookingFullyPaid,
                fullPaymentInvoiceId,
                hasOvernight,
                firstMeal,
                checkinDate,
                checkoutDate,
                bookingPrice,
                requirements,
                paymentStatus,
                staffNotes,
                participantsList,
                roomIds,
                mealIds,
            } = req.body;

            const booking = await Booking.findByPk(req.params.id);
            if (!booking)
                return res.status(404).json({ message: "Booking not found" });

            await booking.update({
                bookingDate,
                depositPaid,
                depositAmount,
                depositPaymentId,
                bookingFullyPaid,
                fullPaymentInvoiceId,
                hasOvernight,
                firstMeal,
                checkinDate,
                checkoutDate,
                bookingPrice,
                requirements,
                paymentStatus,
                staffNotes,
                participantsList,
            });

            if (roomIds) {
                const rooms = await Room.findAll({ where: { id: roomIds } });
                if (rooms.length !== roomIds.length) {
                    return res.status(400).json({
                        message: "One or more room IDs are invalid",
                        validRoomIds: rooms.map((r) => r.id),
                    });
                }
                await booking.setRooms(roomIds);
            }

            if (mealIds) {
                const meals = await Meal.findAll({ where: { id: mealIds } });
                if (meals.length !== mealIds.length) {
                    return res.status(400).json({
                        message: "One or more meal IDs are invalid",
                        validMealIds: meals.map((m) => m.id),
                    });
                }
                await booking.setMeals(mealIds);
            }

            const updatedBooking = await Booking.findByPk(booking.id, {
                include: [Room, User, Meal],
            });

            res.json(updatedBooking);
        } catch (err) {
            res.status(500).json({
                message: "Error updating booking",
                error: err,
            });
        }
    },

    // Delete a booking
    deleteBooking: async (req, res) => {
        try {
            const booking = await Booking.findByPk(req.params.id);
            if (!booking)
                return res.status(404).json({ message: "Booking not found" });

            await booking.destroy();
            res.json({ message: "Booking deleted" });
        } catch (err) {
            res.status(500).json({
                message: "Error deleting booking",
                error: err,
            });
        }
    },
};
