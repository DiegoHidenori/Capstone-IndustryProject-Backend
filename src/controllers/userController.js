const { User } = require("../models");

module.exports = {
	getAllUsers: async (req, res) => {
		try {
			const users = await User.findAll({
				attributes: { exclude: ["password"] },
			});
			res.json(users);
		} catch (err) {
			console.error(
				`[UserController] ${req.method} ${req.originalUrl} Error:`,
				err
			);
			res.status(500).json({ message: "Failed to fetch users" });
		}
	},

	getUserById: async (req, res) => {
		try {
			const user = await User.findByPk(req.params.userId, {
				attributes: { exclude: ["password"] },
			});

			if (!user) {
				return res.status(404).json({ message: "User not found" });
			}

			// Only allow self or admin/staff
			if (
				req.user.userId !== user.userId &&
				req.user.role !== "admin" &&
				req.user.role !== "staff"
			) {
				return res
					.status(403)
					.json({ message: "Not authorized to view this profile" });
			}

			res.json(user);
		} catch (err) {
			console.error(
				`[UserController] ${req.method} ${req.originalUrl} Error:`,
				err
			);
			res.status(500).json({ message: "Failed to fetch user" });
		}
	},

	editUser: async (req, res) => {
		try {
			const user = await User.findByPk(req.params.userId);
			if (!user)
				return res.status(404).json({ message: "User not found" });

			if (
				req.user.userId !== user.userId &&
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
				if (req.body[field] !== undefined) {
					const value = req.body[field];
					user[field] =
						typeof value === "string" && value.trim() === ""
							? null
							: value;
				}
			}

			// Optional: allow self-password update
			if (req.user.userId === user.userId && req.body.password) {
				user.password = req.body.password; // will be hashed by hook
			}

			await user.save();
			res.json({ message: "User updated successfully" });
		} catch (err) {
			console.error(
				`[UserController] ${req.method} ${req.originalUrl} Error:`,
				err
			);
			res.status(500).json({ message: "Failed to update user" });
		}
	},

	deleteUser: async (req, res) => {
		try {
			const user = await User.findByPk(req.params.userId);
			if (!user)
				return res.status(404).json({ message: "User not found" });

			await user.destroy();
			res.json({ message: "User deleted successfully" });
		} catch (err) {
			console.error(
				`[UserController] ${req.method} ${req.originalUrl} Error:`,
				err
			);
			res.status(500).json({ message: "Failed to delete user" });
		}
	},

	promoteUser: async (req, res) => {
		const { role } = req.body;

		if (!["guest", "staff", "admin"].includes(role)) {
			return res.status(400).json({ message: "Invalid role" });
		}

		try {
			const user = await User.findByPk(req.params.userId);
			if (!user)
				return res.status(404).json({ message: "User not found" });

			user.role = role;
			await user.save();

			res.json({ message: `User promoted to ${role}` });
		} catch (err) {
			console.error(
				`[UserController] ${req.method} ${req.originalUrl} Error:`,
				err
			);
			res.status(500).json({ message: "Failed to promote user" });
		}
	},
};
