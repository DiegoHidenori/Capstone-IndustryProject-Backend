const { Discount } = require("../models");

module.exports = {
    // Get all discounts
    getAllDiscounts: async (req, res) => {
        try {
            const discounts = await Discount.findAll();
            res.json(discounts);
        } catch (err) {
            res.status(500).json({
                message: "Error fetching discounts",
                error: err,
            });
        }
    },

    // Get a single discount by ID
    getDiscountById: async (req, res) => {
        try {
            const discount = await Discount.findByPk(req.params.id);
            if (!discount)
                return res.status(404).json({ message: "Discount not found" });
            res.json(discount);
        } catch (err) {
            res.status(500).json({
                message: "Error fetching discount",
                error: err,
            });
        }
    },

    // Create a new discount
    createDiscount: async (req, res) => {
        try {
            const { name, description, type, value } = req.body;

            // Validate type
            if (!["percentage", "fixed"].includes(type)) {
                return res
                    .status(400)
                    .json({
                        message:
                            "Invalid discount type. Use 'percentage' or 'fixed'.",
                    });
            }

            const discount = await Discount.create({
                name,
                description,
                type,
                value,
            });
            res.status(201).json(discount);
        } catch (err) {
            res.status(500).json({
                message: "Error creating discount",
                error: err,
            });
        }
    },

    // Update a discount
    updateDiscount: async (req, res) => {
        try {
            const discount = await Discount.findByPk(req.params.id);
            if (!discount)
                return res.status(404).json({ message: "Discount not found" });

            const { name, description, type, value } = req.body;
            await discount.update({ name, description, type, value });
            res.json(discount);
        } catch (err) {
            res.status(500).json({
                message: "Error updating discount",
                error: err,
            });
        }
    },

    // Delete a discount
    deleteDiscount: async (req, res) => {
        try {
            const discount = await Discount.findByPk(req.params.id);
            if (!discount)
                return res.status(404).json({ message: "Discount not found" });

            await discount.destroy();
            res.json({ message: "Discount deleted" });
        } catch (err) {
            res.status(500).json({
                message: "Error deleting discount",
                error: err,
            });
        }
    },
};
