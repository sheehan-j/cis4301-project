const getTotalTupleCount = async () => {
	const API_URL = "http://localhost:8089/api/total-count";

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
	getTotalTupleCount,
};
