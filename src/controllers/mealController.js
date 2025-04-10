const { Meal } = require("../models");

module.exports = {
	// Get all meals
	getAllMeals: async (req, res) => {
		try {
			const meals = await Meal.findAll();
			res.json(meals);
		} catch (err) {
			console.error("[MealController] Error fetching meals:", err);
			res.status(500).json({ message: "Error fetching meals" });
		}
	},

	// Get one meal
	getMealById: async (req, res) => {
		try {
			const meal = await Meal.findByPk(req.params.mealId);
			if (!meal) {
				return res.status(404).json({ message: "Meal not found" });
			}
			res.json(meal);
		} catch (err) {
			console.error("[MealController] Error fetching meal:", err);
			res.status(500).json({ message: "Error fetching meal" });
		}
	},

	// Create a meal
	createMeal: async (req, res) => {
		try {
			const { name, price } = req.body;

			if (!name || typeof name !== "string") {
				return res
					.status(400)
					.json({
						message: "Meal name is required and must be a string.",
					});
			}
			if (isNaN(price) || price < 0) {
				return res
					.status(400)
					.json({
						message: "Meal price must be a valid number >= 0.",
					});
			}

			const meal = await Meal.create({
				name: name.trim(),
				price: parseFloat(price),
			});
			res.status(201).json(meal);
		} catch (err) {
			console.error("[MealController] Error creating meal:", err);
			res.status(500).json({ message: "Error creating meal" });
		}
	},

	// Update a meal
	updateMeal: async (req, res) => {
		try {
			const meal = await Meal.findByPk(req.params.mealId);
			if (!meal) {
				return res.status(404).json({ message: "Meal not found" });
			}

			const { name, price } = req.body;

			if (name && typeof name !== "string") {
				return res
					.status(400)
					.json({ message: "Meal name must be a string." });
			}
			if (price !== undefined && (isNaN(price) || price < 0)) {
				return res
					.status(400)
					.json({
						message: "Meal price must be a valid number >= 0.",
					});
			}

			await meal.update({
				name: name !== undefined ? name.trim() : meal.name,
				price: price !== undefined ? parseFloat(price) : meal.price,
			});

			res.json(meal);
		} catch (err) {
			console.error("[MealController] Error updating meal:", err);
			res.status(500).json({ message: "Error updating meal" });
		}
	},

	// Delete a meal
	deleteMeal: async (req, res) => {
		try {
			const meal = await Meal.findByPk(req.params.mealId);
			if (!meal) {
				return res.status(404).json({ message: "Meal not found" });
			}

			await meal.destroy();
			res.json({ message: "Meal deleted successfully" });
		} catch (err) {
			console.error("[MealController] Error deleting meal:", err);
			res.status(500).json({ message: "Error deleting meal" });
		}
	},
};
