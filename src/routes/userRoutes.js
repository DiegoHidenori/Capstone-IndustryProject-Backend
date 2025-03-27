const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const {
    authenticateUser,
    authorizeRoles,
} = require("../middleware/authMiddleware");

router.get(
    "/",
    authenticateUser,
    authorizeRoles("admin", "staff"),
    userController.getAllUsers
);

// GET /users/:id - Get single user profile (self or admin/staff)
router.get("/:userId", authenticateUser, userController.getUserById);

// PUT /users/:id - Update user info (self or admin/staff)
router.put("/:userId", authenticateUser, userController.editUser);

// DELETE /users/:id - Only admin can delete
router.delete(
    "/:userId",
    authenticateUser,
    authorizeRoles("admin"),
    userController.deleteUser
);

// PATCH /users/:id/promote - Only admin/staff can promote user
router.patch(
    "/:userId/promote",
    authenticateUser,
    authorizeRoles("admin", "staff"),
    userController.promoteUser
);

module.exports = router;
