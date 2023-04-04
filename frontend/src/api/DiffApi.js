const getDiffData = async (group1, group2, granularity, minDate, maxDate) => {
	const API_URL = `http://localhost:8089/api/difference/${granularity}/${group1}/${group2}/${minDate}/${maxDate}`;

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
	getDiffData,
};
