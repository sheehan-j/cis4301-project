const getDataByAgeGroup = async (granularity, minDate, maxDate) => {
	const API_URL = `http://localhost:8089/api/age-group/${granularity}/${minDate}/${maxDate}`;

	const response = await fetch(API_URL, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});
	if (response.status !== 200) {
		alert("Error making request to server.");
	}

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
	if (response.status !== 200) {
		alert("Error making request to server.");
	}

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
	if (response.status !== 200) {
		alert("Error making request to server.");
	}

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
	if (response.status !== 200) {
		alert("Error making request to server.");
	}

	const result = await response.json();
	return result;
};

const getDataByRegion = async (granularity, minDate, maxDate) => {
	const API_URL = `http://localhost:8089/api/region/${granularity}/${minDate}/${maxDate}`;

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
	getDataByState,
	getDataByAgeGroup,
	getDataByCondition,
	getDataByConditionGroup,
	getDataByRegion
};
