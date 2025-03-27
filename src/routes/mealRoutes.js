const express = require("express");
const router = express.Router();
const mealController = require("../controllers/mealController");

const {
    authenticateUser,
    authorizeRoles,
} = require("../middleware/authMiddleware");

router.get("/", authenticateUser, mealController.getAllMeals);
router.get("/:mealId", authenticateUser, mealController.getMealById);
router.post(
    "/",
    authenticateUser,
    authorizeRoles("admin", "staff"),
    mealController.createMeal
);
router.put(
    "/:mealId",
    authenticateUser,
    authorizeRoles("admin", "staff"),
    mealController.updateMeal
);
router.delete(
    "/:mealId",
    authenticateUser,
    authorizeRoles("admin", "staff"),
    mealController.deleteMeal
);

module.exports = router;
