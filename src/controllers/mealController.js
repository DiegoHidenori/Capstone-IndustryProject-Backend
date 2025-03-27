const { Meal } = require("../models");

module.exports = {
    // Get all meals
    getAllMeals: async (req, res) => {
        try {
            const meals = await Meal.findAll();
            res.json(meals);
        } catch (err) {
            res.status(500).json({
                message: "Error fetching meals",
                error: err,
            });
        }
    },

    // Get one meal
    getMealById: async (req, res) => {
        try {
            const meal = await Meal.findByPk(req.params.mealId);
            if (!meal)
                return res.status(404).json({ message: "Meal not found" });
            res.json(meal);
        } catch (err) {
            res.status(500).json({
                message: "Error fetching meal",
                error: err,
            });
        }
    },

    // Create a meal
    createMeal: async (req, res) => {
        try {
            const { name, price } = req.body;
            const meal = await Meal.create({ name, price });
            res.status(201).json(meal);
        } catch (err) {
            res.status(500).json({
                message: "Error creating meal",
                error: err,
            });
        }
    },

    // Update a meal
    updateMeal: async (req, res) => {
        try {
            const meal = await Meal.findByPk(req.params.mealId);
            if (!meal)
                return res.status(404).json({ message: "Meal not found" });

            const { name, price } = req.body;
            await meal.update({ name, price });
            res.json(meal);
        } catch (err) {
            res.status(500).json({
                message: "Error updating meal",
                error: err,
            });
        }
    },

    // Delete a meal
    deleteMeal: async (req, res) => {
        try {
            const meal = await Meal.findByPk(req.params.mealId);
            if (!meal)
                return res.status(404).json({ message: "Meal not found" });

            await meal.destroy();
            res.json({ message: "Meal deleted" });
        } catch (err) {
            res.status(500).json({
                message: "Error deleting meal",
                error: err,
            });
        }
    },
};
