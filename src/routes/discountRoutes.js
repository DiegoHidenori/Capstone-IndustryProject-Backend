const express = require("express");
const router = express.Router();
const discountController = require("../controllers/discountController");
const {
    authenticateUser,
    authorizeRoles,
} = require("../middleware/authMiddleware");

router.get("/", authenticateUser, discountController.getAllDiscounts);
router.get(
    "/:discountId",
    authenticateUser,
    discountController.getDiscountById
);
router.post(
    "/",
    authenticateUser,
    authorizeRoles("admin", "staff"),
    discountController.createDiscount
);
router.put(
    "/:discountId",
    authenticateUser,
    authorizeRoles("admin", "staff"),
    discountController.updateDiscount
);
router.delete(
    "/:discountId",
    authenticateUser,
    authorizeRoles("admin", "staff"),
    discountController.deleteDiscount
);

module.exports = router;
