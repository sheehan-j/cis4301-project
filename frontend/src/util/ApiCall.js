const AveragesApi = require("../api/AveragesApi");

const AverageApiCall = async (grouping, granularity, minDate, maxDate) => {
	let result;

	switch (grouping) {
		case "age":
			result = await AveragesApi.getDataByAgeGroup(
				granularity,
				minDate,
				maxDate
			);
			break;
		case "condition":
			result = await AveragesApi.getDataByCondition(
				granularity,
				minDate,
				maxDate
			);
			break;
		case "conditiongroup":
			result = await AveragesApi.getDataByConditionGroup(
				granularity,
				minDate,
				maxDate
			);
			break;
		case "state":
			result = await AveragesApi.getDataByState(
				granularity,
				minDate,
				maxDate
			);
			break;
		default:
			return null;
	}

	return result;
};

module.exports = {
	AverageApiCall,
};
