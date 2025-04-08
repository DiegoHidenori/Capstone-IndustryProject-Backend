const express = require("express");
const router = express.Router();
const {
	authenticateUser,
	authorizeRoles,
} = require("../middleware/authMiddleware");
const roomController = require("../controllers/roomController");

router.get("/", authenticateUser, roomController.getAllRooms);
router.get("/:roomId", authenticateUser, roomController.getRoomById);
router.post(
	"/",
	authenticateUser,
	authorizeRoles("admin", "staff"),
	roomController.createRoom
);
router.put(
	"/:roomId",
	authenticateUser,
	authorizeRoles("admin", "staff"),
	roomController.editRoom
);
router.delete(
	"/:roomId",
	authenticateUser,
	authorizeRoles("admin", "staff"),
	roomController.deleteRoom
);

module.exports = router;
