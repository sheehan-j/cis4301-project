const verifyDates = (min, max, granularity) => {
	if (granularity === "monthly") {
		const minDateParts = min.split("_");
		const maxDateParts = max.split("_");

		if (minDateParts[1] < maxDateParts[1]) {
			return true;
		} else if (minDateParts[1] > maxDateParts[1]) {
			return false;
		} else {
			if (minDateParts[0] < maxDateParts[0]) {
				return true;
			} else {
				return false;
			}
		}
	} else {
		return min < max;
	}
};

module.exports = { verifyDates };
