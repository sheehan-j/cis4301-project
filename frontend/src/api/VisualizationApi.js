const apiCall = async (grouping, granularity, minDate, maxDate) => {
	let result;

	switch (grouping) {
		case "age":
			result = await getDataByAgeGroup(granularity, minDate, maxDate);
			break;
		case "condition":
			result = await getDataByCondition(granularity, minDate, maxDate);
			break;
		case "conditiongroup":
			result = await getDataByConditionGroup(
				granularity,
				minDate,
				maxDate
			);
			break;
		case "state":
			result = await getDataByState(granularity, minDate, maxDate);
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

const getDataByCondition = async (granularity, minDate, maxDate) => {
	const API_URL = `http://localhost:8089/api/condition/${granularity}/${minDate}/${maxDate}`;

	const response = await fetch(API_URL, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});
	const result = await response.json();
	return result;
};

const getDataByConditionGroup = async (granularity, minDate, maxDate) => {
	const API_URL = `http://localhost:8089/api/condition-group/${granularity}/${minDate}/${maxDate}`;

	const response = await fetch(API_URL, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});
	const result = await response.json();
	return result;
};

const getDataByState = async (granularity, minDate, maxDate) => {
	const API_URL = `http://localhost:8089/api/state/${granularity}/${minDate}/${maxDate}`;

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
	getDataByState,
};
