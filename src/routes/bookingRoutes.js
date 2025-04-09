const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const {
	authenticateUser,
	authorizeRoles,
} = require("../middleware/authMiddleware");

router.post("/", authenticateUser, bookingController.createBooking);
router.get("/", authenticateUser, bookingController.getAllBookings);
router.get("/:bookingId", authenticateUser, bookingController.getBookingById);
router.put(
	"/:bookingId",
	authenticateUser,
	authorizeRoles("admin", "staff"),
	bookingController.updateBooking
);
router.delete(
	"/:bookingId",
	authenticateUser,
	authorizeRoles("admin", "staff"),
	bookingController.deleteBooking
);

module.exports = router;
