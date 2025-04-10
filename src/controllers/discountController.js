const { Discount } = require("../models");

module.exports = {
	// Get all discounts
	getAllDiscounts: async (req, res) => {
		try {
			const discounts = await Discount.findAll();
			res.json(discounts);
		} catch (err) {
			console.error("Error fetching discounts:", err);
			res.status(500).json({
				message: "Error fetching discounts",
				error: err,
			});
		}
	},

	// Get a single discount by ID
	getDiscountById: async (req, res) => {
		try {
			const discount = await Discount.findByPk(req.params.discountId);
			if (!discount)
				return res.status(404).json({ message: "Discount not found" });
			res.json(discount);
		} catch (err) {
			console.error("Error fetching discount:", err);
			res.status(500).json({
				message: "Error fetching discount",
				error: err,
			});
		}
	},

	// Create a new discount
	createDiscount: async (req, res) => {
		try {
			const { name, description, discountType, discountValue } = req.body;

			// Validation
			if (!["percentage", "fixed"].includes(discountType)) {
				return res.status(400).json({
					message:
						"Invalid discount type. Must be 'percentage' or 'fixed'.",
				});
			}

			if (isNaN(discountValue) || discountValue < 0) {
				return res.status(400).json({
					message: "Discount value must be a positive number.",
				});
			}

			const discount = await Discount.create({
				name,
				description,
				discountType,
				discountValue,
			});

			res.status(201).json(discount);
		} catch (err) {
			console.error("Error creating discount:", err);
			res.status(500).json({
				message: "Error creating discount",
				error: err,
			});
		}
	},

	// Update a discount
	updateDiscount: async (req, res) => {
		try {
			const discount = await Discount.findByPk(req.params.discountId);
			if (!discount)
				return res.status(404).json({ message: "Discount not found" });

			const { name, description, discountType, discountValue } = req.body;

			if (!["percentage", "fixed"].includes(discountType)) {
				return res.status(400).json({
					message:
						"Invalid discount type. Must be 'percentage' or 'fixed'.",
				});
			}

			if (isNaN(discountValue) || discountValue < 0) {
				return res.status(400).json({
					message: "Discount value must be a positive number.",
				});
			}

			await discount.update({
				name,
				description,
				discountType,
				discountValue,
			});

			res.json(discount);
		} catch (err) {
			console.error("Error updating discount:", err);
			res.status(500).json({
				message: "Error updating discount",
				error: err,
			});
		}
	},

	// Delete a discount
	deleteDiscount: async (req, res) => {
		try {
			const discount = await Discount.findByPk(req.params.discountId);
			if (!discount)
				return res.status(404).json({ message: "Discount not found" });

			await discount.destroy();
			res.json({ message: "Discount deleted" });
		} catch (err) {
			console.error("Error deleting discount:", err);
			res.status(500).json({
				message: "Error deleting discount",
				error: err,
			});
		}
	},
};
