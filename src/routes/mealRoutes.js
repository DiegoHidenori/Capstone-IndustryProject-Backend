const express = require("express");
const router = express.Router();
const mealController = require("../controllers/mealController");

router.get("/", mealController.getAllMeals);
router.get("/:id", mealController.getMealById);
router.post("/", mealController.createMeal);
router.put("/:id", mealController.updateMeal);
router.delete("/:id", mealController.deleteMeal);

module.exports = router;
