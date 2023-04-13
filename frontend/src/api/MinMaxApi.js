const getMinMaxData = async (
	group,
	type,
	granularity,
	minDate,
	maxDate,
	excludedValues
) => {
	let API_URL = `http://localhost:8089/api/minmax/${granularity}/${type}/${group}/${minDate}/${maxDate}`;

	if (excludedValues !== "") {
		API_URL += `?excludedValues=${excludedValues}`;
	}

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
	getMinMaxData,
};
