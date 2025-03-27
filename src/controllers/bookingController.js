const { Booking, Room, User, Meal, Discount, Invoice } = require("../models");

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

    let finalPrice =
        parseFloat(bookingPrice) + totalMealCost - totalDiscountAmount;
    return Math.max(finalPrice, 0);
}

module.exports = {
    createBooking: async (req, res) => {
        try {
            const {
                userId,
                bookingDate,
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
            } = req.body;

            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(400).json({ message: "User does not exist" });
            }

            let rooms = [];
            if (roomIds?.length) {
                rooms = await Room.findAll({ where: { roomId: roomIds } });
                if (rooms.length !== roomIds.length) {
                    return res.status(400).json({
                        message: "One or more room IDs are invalid",
                        validRoomIds: rooms.map((r) => r.roomId),
                    });
                }
            }

            const finalPrice = await calculateTotalPrice(
                bookingPrice,
                mealIds,
                discountIds
            );

            // let meals = [];
            // let totalMealCost = 0;
            // if (mealIds?.length) {
            //     meals = await Meal.findAll({ where: { mealId: mealIds } });
            //     if (meals.length !== mealIds.length) {
            //         return res.status(400).json({
            //             message: "One or more meal IDs are invalid",
            //             validMealIds: meals.map((m) => m.mealId),
            //         });
            //     }

            //     totalMealCost = meals.reduce(
            //         (sum, meal) => sum + parseFloat(meal.price),
            //         0
            //     );
            // }

            // let discounts = [];
            // let totalDiscountAmount = 0;
            // if (discountIds?.length) {
            //     discounts = await Discount.findAll({
            //         where: { discountId: discountIds },
            //     });
            //     if (discounts.length !== discountIds.length) {
            //         return res.status(400).json({
            //             message: "One or more discount IDs are invalid",
            //             validDiscountIds: discounts.map((d) => d.discountId),
            //         });
            //     }

            //     for (const discount of discounts) {
            //         if (discount.discountType === "percentage") {
            //             totalDiscountAmount +=
            //                 (parseFloat(bookingPrice) + totalMealCost) *
            //                 (parseFloat(discount.discountValue) / 100);
            //         } else if (discount.discountType === "fixed") {
            //             totalDiscountAmount += parseFloat(
            //                 discount.discountValue
            //             );
            //         }
            //     }
            // }

            // Final price = booking price + meal cost (optional)
            // let finalPrice =
            //     parseFloat(bookingPrice) + totalMealCost - totalDiscountAmount;
            // finalPrice = Math.max(finalPrice, 0);

            const booking = await Booking.create({
                userId,
                bookingDate,
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
            console.log("Fetching booking with ID:", req.params.bookingId);
            const booking = await Booking.findByPk(req.params.bookingId, {
                include: [Room, User, Meal, Discount, Invoice],
            });

            if (!booking) {
                console.log("Booking not found for ID:", req.params.bookingId);
                return res.status(404).json({ message: "Booking not found" });
            }

            console.log("Fetched Booking:", JSON.stringify(booking, null, 2));

            // let originalPrice = parseFloat(booking.bookingPrice);
            // let mealTotal = booking.Meals.reduce(
            //     (sum, meal) => sum + parseFloat(meal.price),
            //     0
            // );

            let discountBreakdown = [];
            let totalDiscountAmount = 0;

            console.log("Starting for loop...");
            for (const discount of booking.Discounts) {
                let discountAmount = 0;
                if (discount.discountType === "percentage") {
                    discountAmount =
                        (parseFloat(booking.bookingPrice) +
                            booking.Meals.reduce(
                                (sum, meal) => sum + parseFloat(meal.price),
                                0
                            )) *
                        (parseFloat(discount.discountValue) / 100);
                } else if (discount.discountType === "fixed") {
                    discountAmount = parseFloat(discount.discountValue);
                }

                totalDiscountAmount += discountAmount;

                console.log("Pushing to discountBreakdown...");
                discountBreakdown.push({
                    discountName: discount.name,
                    type: discount.discountType,
                    value: discount.discountValue,
                    discountAmount: discountAmount.toFixed(2),
                });

                console.log("-----------------------ASDKFASODFJAOSIDJF");
            }

            // let finalPrice = originalPrice + mealTotal - totalDiscountAmount;
            // if (finalPrice < 0) finalPrice = 0;

            // if (booking.bookingPrice.toFixed(2)) {
            //     console.log("TRUE");
            // } else {
            //     console.log("NOT TRUE");
            // }
            console.log("aosidjfoisajd", booking);

            const response = {
                id: booking.bookingId,
                bookingDate: booking.bookingDate,
                finalPrice: parseFloat(booking.bookingPrice).toFixed(2),
                discountBreakdown,
                totalDiscountAmount: totalDiscountAmount.toFixed(2),
                discountBreakdown,
                Rooms: booking.Rooms,
                Meals: booking.Meals,
                Discounts: booking.Discounts,
                Invoice: booking.Invoice,
                User: booking.User,
            };
            console.log("filled response const var");

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
            } = req.body;

            const booking = await Booking.findByPk(req.params.bookingId, {
                include: [Invoice],
            });
            if (!booking)
                return res.status(404).json({ message: "Booking not found" });

            let finalPrice = await calculateTotalPrice(
                bookingPrice,
                mealIds,
                discountIds
            );

            // if (roomIds) {
            //     const rooms = await Room.findAll({
            //         where: { roomId: roomIds },
            //     });
            //     if (rooms.length !== roomIds.length) {
            //         return res.status(400).json({
            //             message: "One or more room IDs are invalid",
            //             validRoomIds: rooms.map((r) => r.roomId),
            //         });
            //     }
            //     await booking.setRooms(roomIds);
            // }

            // if (mealIds) {
            //     const meals = await Meal.findAll({
            //         where: { mealId: mealIds },
            //     });
            //     if (meals.length !== mealIds.length) {
            //         return res.status(400).json({
            //             message: "One or more meal IDs are invalid",
            //             validMealIds: meals.map((m) => m.mealId),
            //         });
            //     }
            //     mealTotal = meals.reduce(
            //         (sum, meal) => sum + parseFloat(meal.price),
            //         0
            //     );
            //     await booking.setMeals(mealIds);
            // }

            // let totalDiscountAmount = 0;
            // if (discountIds) {
            //     const discounts = await Discount.findAll({
            //         where: { discountId: discountIds },
            //     });
            //     if (discounts.length !== discountIds.length) {
            //         return res.status(400).json({
            //             message: "One or more discount IDs are invalid",
            //             validDiscountIds: discounts.map((d) => d.discountId),
            //         });
            //     }
            //     for (const discount of discounts) {
            //         if (discount.discountType === "percentage") {
            //             totalDiscountAmount +=
            //                 (finalPrice + mealTotal) *
            //                 (parseFloat(discount.discountValue) / 100);
            //         } else if (discount.discountType === "fixed") {
            //             totalDiscountAmount += parseFloat(
            //                 discount.discountValue
            //             );
            //         }
            //     }
            //     await booking.setDiscounts(discountIds);
            // }

            // finalPrice = finalPrice + mealTotal - totalDiscountAmount;
            // finalPrice = Math.max(finalPrice, 0);

            await booking.update({
                bookingDate,
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

            if (booking.Invoice) {
                await booking.Invoice.update({
                    totalAmount: finalPrice,
                    depositAmount: finalPrice * 0.2, // Recalculate deposit
                });
            }

            const updatedBooking = await Booking.findByPk(booking.bookingId, {
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
            const booking = await Booking.findByPk(req.params.bookingId);
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
