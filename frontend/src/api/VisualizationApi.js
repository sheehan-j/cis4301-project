const apiCall = async (grouping, granularity, minDate, maxDate) => {
	let result;

	switch (grouping) {
		case "age":
			result = await getDataByAgeGroup(granularity, minDate, maxDate);
			break;
		default:
			return null;
	}

	return result;
};

const getDataByAgeGroup = async (granularity, minDate, maxDate) => {
	const API_URL = `http://localhost:8089/api/age-group/${granularity}/${minDate}/${maxDate}`;

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
	apiCall,
	getDataByAgeGroup,
};
