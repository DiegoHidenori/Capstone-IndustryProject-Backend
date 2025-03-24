const { Booking, Room, User, Meal, Discount, Invoice } = require("../models");

async function createInvoice(bookingId, totalAmount) {
    const depositRequired = totalAmount * 0.2;
    return await Invoice.create({
        bookingId,
        totalAmount,
        depositRequired,
        status: "unpaid",
    });
}

module.exports = {
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
                roomIds,
                mealIds,
                discountIds,
            } = req.body;

            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(400).json({ message: "User does not exist" });
            }

            let rooms = [];
            if (roomIds && roomIds.length > 0) {
                rooms = await Room.findAll({ where: { id: roomIds } });
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

            let discounts = [];
            let totalDiscountAmount = 0;
            if (discountIds && discountIds.length > 0) {
                discounts = await Discount.findAll({
                    where: { id: discountIds },
                });
                if (discounts.length !== discountIds.length) {
                    return res.status(400).json({
                        message: "One or more discount IDs are invalid",
                        validDiscountIds: discounts.map((d) => d.id),
                    });
                }

                // Calculate the total discount amount
                for (const discount of discounts) {
                    if (discount.type === "percentage") {
                        totalDiscountAmount +=
                            (parseFloat(bookingPrice) + totalMealCost) *
                            (parseFloat(discount.value) / 100);
                    } else if (discount.type === "fixed") {
                        totalDiscountAmount += parseFloat(discount.value);
                    }
                }
            }

            // 🧾 Final price = booking price + meal cost (optional)
            const finalPrice =
                parseFloat(bookingPrice) + totalMealCost - totalDiscountAmount;
            if (finalPrice < 0) finalPrice = 0;

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
                bookingPrice: finalPrice,
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

            if (discountIds && discountIds.length > 0) {
                await booking.setDiscounts(discountIds);
            }

            await createInvoice(booking.id, finalPrice);

            const fullBooking = await Booking.findByPk(booking.id, {
                include: [Room, User, Meal, Discount, Invoice],
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
                include: [Room, User, Meal, Discount, Invoice],
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
                include: [Room, User, Meal, Discount, Invoice],
            });

            if (!booking)
                return res.status(404).json({ message: "Booking not found" });

            let originalPrice = parseFloat(booking.bookingPrice);
            let mealTotal = booking.Meals.reduce(
                (sum, meal) => sum + parseFloat(meal.price),
                0
            );

            let discountBreakdown = [];
            let totalDiscountAmount = 0;
            for (const discount of booking.Discounts) {
                let discountAmount = 0;
                if (discount.type === "percentage") {
                    discountAmount =
                        (originalPrice + mealTotal) *
                        (parseFloat(discount.value) / 100);
                } else if (discount.type === "fixed") {
                    discountAmount = parseFloat(discount.value);
                }

                totalDiscountAmount += discountAmount;

                discountBreakdown.push({
                    discountName: discount.name,
                    type: discount.type,
                    value: discount.value,
                    discountAmount: discountAmount.toFixed(2),
                });
            }

            let finalPrice = originalPrice + mealTotal - totalDiscountAmount;
            if (finalPrice < 0) finalPrice = 0;

            const response = {
                id: booking.id,
                bookingDate: booking.bookingDate,
                originalPrice: (originalPrice + mealTotal).toFixed(2),
                discountBreakdown,
                totalDiscountAmount: totalDiscountAmount.toFixed(2),
                finalPrice: finalPrice.toFixed(2),
                Rooms: booking.Rooms,
                Meals: booking.Meals,
                Discounts: booking.Discounts,
                Invoice: booking.Invoice,
                User: booking.User,
            };

            res.json(response);
        } catch (err) {
            res.status(500).json({
                message: "Error fetching booking",
                error: err,
            });
        }
    },

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
                discountIds,
            } = req.body;

            const booking = await Booking.findByPk(req.params.id);
            if (!booking)
                return res.status(404).json({ message: "Booking not found" });

            let finalPrice = parseFloat(bookingPrice);
            let mealTotal = 0;

            // Validate and fetch rooms
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

            // Validate and fetch meals
            if (mealIds) {
                const meals = await Meal.findAll({ where: { id: mealIds } });
                if (meals.length !== mealIds.length) {
                    return res.status(400).json({
                        message: "One or more meal IDs are invalid",
                        validMealIds: meals.map((m) => m.id),
                    });
                }
                mealTotal = meals.reduce(
                    (sum, meal) => sum + parseFloat(meal.price),
                    0
                );
                await booking.setMeals(mealIds);
            }

            // Validate and fetch discounts
            let totalDiscountAmount = 0;
            if (discountIds) {
                const discounts = await Discount.findAll({
                    where: { id: discountIds },
                });
                if (discounts.length !== discountIds.length) {
                    return res.status(400).json({
                        message: "One or more discount IDs are invalid",
                        validDiscountIds: discounts.map((d) => d.id),
                    });
                }
                for (const discount of discounts) {
                    if (discount.type === "percentage") {
                        totalDiscountAmount +=
                            (finalPrice + mealTotal) *
                            (parseFloat(discount.value) / 100);
                    } else if (discount.type === "fixed") {
                        totalDiscountAmount += parseFloat(discount.value);
                    }
                }
                await booking.setDiscounts(discountIds);
            }

            // Recalculate final price
            finalPrice = finalPrice + mealTotal - totalDiscountAmount;
            if (finalPrice < 0) finalPrice = 0;

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
                bookingPrice: finalPrice,
                requirements,
                paymentStatus,
                staffNotes,
                participantsList,
            });

            const updatedBooking = await Booking.findByPk(booking.id, {
                include: [Room, User, Meal, Discount, Invoice],
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
