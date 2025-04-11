function validateBookingPayload(payload) {
	const errors = [];

	// Enum check for firstMeal
	const allowedMeals = ["breakfast", "lunch", "dinner"];
	if (payload.firstMeal) {
		if (
			typeof payload.firstMeal !== "string" ||
			!allowedMeals.includes(payload.firstMeal.toLowerCase())
		) {
			errors.push(`firstMeal must be one of: ${allowedMeals.join(", ")}`);
		}
	}

	// Check date logic
	if (payload.checkinDate && payload.checkoutDate) {
		const now = new Date();
		if (new Date(payload.checkinDate) < now.setHours(0, 0, 0, 0)) {
			errors.push("Check-in date cannot be in the past.");
		}

		const checkin = new Date(payload.checkinDate);
		const checkout = new Date(payload.checkoutDate);
		if (checkin >= checkout) {
			errors.push("Check-out date must be after check-in date.");
		}
	}

	// Requirements array
	if (payload.requirements && !Array.isArray(payload.requirements)) {
		errors.push("Requirements must be an array of strings.");
	}

	// Participants list array
	if (payload.participantsList && !Array.isArray(payload.participantsList)) {
		errors.push("Participants list must be an array of strings.");
	}

	// Array checks for IDs
	const arrayFields = ["roomIds", "mealIds", "discountIds"];
	for (const field of arrayFields) {
		if (field in payload && !Array.isArray(payload[field])) {
			errors.push(`${field} must be an array.`);
		}
	}

	// Optional: check bookingPrice is a valid number
	if (payload.bookingPrice && isNaN(parseFloat(payload.bookingPrice))) {
		errors.push("bookingPrice must be a valid number.");
	}

	return errors;
}

module.exports = validateBookingPayload;
