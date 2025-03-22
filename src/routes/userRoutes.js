const express = require("express");
const router = express.Router();
const { User } = require("../models");
const {
    authenticateUser,
    authorizeRoles,
} = require("../middleware/authMiddleware");

// GET /users - List all users (admin/staff only)
router.get(
    "/",
    authenticateUser,
    authorizeRoles("admin", "staff"),
    async (req, res) => {
        try {
            const users = await User.findAll({
                attributes: { exclude: ["password"] },
            });
            res.json(users);
        } catch (err) {
            console.error("Error fetching users:", err);
            res.status(500).json({ message: "Failed to fetch users" });
        }
    }
);

// GET /users/:id - Get single user profile (self or admin/staff)
router.get("/:id", authenticateUser, async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: { exclude: ["password"] },
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Only allow self or admin/staff
        if (
            req.user.id !== user.id &&
            req.user.role !== "admin" &&
            req.user.role !== "staff"
        ) {
            return res
                .status(403)
                .json({ message: "Not authorized to view this profile" });
        }

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch user" });
    }
});

// PUT /users/:id - Update user info (self or admin/staff)
router.put("/:id", authenticateUser, async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (
            req.user.id !== user.id &&
            req.user.role !== "admin" &&
            req.user.role !== "staff"
        ) {
            return res
                .status(403)
                .json({ message: "Not authorized to update this user" });
        }

        const fields = [
            "firstName",
            "middleName",
            "lastName",
            "email",
            "phone",
            "billingAddress",
        ];
        for (let field of fields) {
            if (req.body[field] !== undefined) user[field] = req.body[field];
        }

        // Optional: allow self-password update
        if (req.user.id === user.id && req.body.password) {
            user.password = req.body.password; // will be hashed by hook
        }

        await user.save();
        res.json({ message: "User updated successfully" });
    } catch (err) {
        res.status(500).json({ message: "Failed to update user" });
    }
});

// DELETE /users/:id - Only admin can delete
router.delete(
    "/:id",
    authenticateUser,
    authorizeRoles("admin"),
    async (req, res) => {
        try {
            const user = await User.findByPk(req.params.id);
            if (!user)
                return res.status(404).json({ message: "User not found" });

            await user.destroy();
            res.json({ message: "User deleted successfully" });
        } catch (err) {
            res.status(500).json({ message: "Failed to delete user" });
        }
    }
);

// PATCH /users/:id/promote - Only admin/staff can promote user
router.patch(
    "/:id/promote",
    authenticateUser,
    authorizeRoles("admin", "staff"),
    async (req, res) => {
        const { role } = req.body;

        if (!["guest", "staff", "admin"].includes(role)) {
            return res.status(400).json({ message: "Invalid role" });
        }

        try {
            const user = await User.findByPk(req.params.id);
            if (!user)
                return res.status(404).json({ message: "User not found" });

            user.role = role;
            await user.save();

            res.json({ message: `User promoted to ${role}` });
        } catch (err) {
            res.status(500).json({ message: "Failed to promote user" });
        }
    }
);

module.exports = router;
