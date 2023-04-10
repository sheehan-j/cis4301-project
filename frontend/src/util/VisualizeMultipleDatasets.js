const trendlineConfig = require("../config/trendlineConfig");

const VisualizeMultipleDatasets = async (data) => {
	const activeTrendlinesLimit = 2;

	data[0].active = true;
	data[0].id = 0;
	data[0].color = trendlineConfig.trendlineColors[0];
	data[1].active = true;
	data[1].id = 1;
	data[1].color = trendlineConfig.trendlineColors[1];
	data[1].yAxisID = "y1";

	const datasets = [];
	datasets.push({
		label: data[0].name,
		data: data[0].values,
		borderColor: data[0].color,
		backgroundColor: data[0].color,
	});
	datasets.push({
		label: data[1].name,
		data: data[1].values,
		borderColor: data[1].color,
		backgroundColor: data[1].color,
		yAxisID: data[1].yAxisID,
	});

	const newVisualizedData = {
		labels: data[0].labels,
		datasets: datasets,
	};
	const newAllData = [data[0], data[1]];

	const result = {
		visualizedData: newVisualizedData,
		allData: newAllData,
		activeTrendlines: activeTrendlinesLimit,
		legend: data[2].legend,
	};

	return result;
};

module.exports = VisualizeMultipleDatasets;
