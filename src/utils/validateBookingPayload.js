function validateBookingPayload(payload) {
	const errors = [];

	const allowedMeals = ["breakfast", "lunch", "dinner"];
	if (
		payload.firstMeal &&
		!allowedMeals.includes(payload.firstMeal.toLowerCase())
	) {
		errors.push(`firstMeal must be one of: ${allowedMeals.join(", ")}`);
	}

	if (payload.requirements && !Array.isArray(payload.requirements)) {
		errors.push("Requirements must be an array of strings.");
	}

	if (payload.participantsList && !Array.isArray(payload.participantsList)) {
		errors.push("Participants list must be an array of strings.");
	}

	return errors;
}

module.exports = validateBookingPayload;
