const getMaxData = async (group, granularity, minDate, maxDate) => {
	const API_URL = `http://localhost:8089/api/max/${granularity}/${group}/${minDate}/${maxDate}`;

	const response = await fetch(API_URL, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});
	const result = await response.json();
	return result;
};

module.exports = {
	getMaxData,
};
