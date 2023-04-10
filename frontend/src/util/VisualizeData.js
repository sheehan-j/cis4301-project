const trendlineConfig = require("../config/trendlineConfig");

const VisualizeData = async (type, dataFromApi) => {
	let activeTrendlinesLimit;
	if (type === "average") {
		activeTrendlinesLimit = 5;
	} else if (type === "difference") {
		activeTrendlinesLimit = 1;
	} else if (type === "maximal") {
		activeTrendlinesLimit = 1;
	}

	// Add an attribute to track whether
	// each trendline is being visualized
	dataFromApi.map((item, index) => {
		item.active = index < activeTrendlinesLimit;
		item.id = index;
		item.color = trendlineConfig.trendlineColors[index];
		return item;
	});

	const datasets = [];
	dataFromApi.forEach((item) => {
		if (item.active) {
			const newDataset = {
				label: item.name,
				data: item.values,
				borderColor: item.color,
				backgroundColor: item.color,
			};

			datasets.push(newDataset);
		}
	});

	const data = {
		labels: dataFromApi[0].labels,
		datasets: datasets,
	};

	const result = {
		visualizedData: data,
		allData: dataFromApi,
		activeTrendlines: activeTrendlinesLimit,
	};

	return result;
};

module.exports = {
	VisualizeData,
};
