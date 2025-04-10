function sanitizePayload(payload, allowedFields) {
	return Object.fromEntries(
		Object.entries(payload).filter(([key]) => allowedFields.includes(key))
	);
}

module.exports = sanitizePayload;
