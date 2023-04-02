const trendlineConfig = require("../config/trendlineConfig");

const UpdateNewActiveTrendlines = (id, allData, activeTrendlines) => {
	const targetSelector = allData.filter((item) => item.id === id)[0];

	if (targetSelector.active) {
		activeTrendlines -= 1;
		targetSelector.active = false;
	} else {
		activeTrendlines += 1;
		targetSelector.active = true;
	}

	// Replace target selector with its replaced version
	allData.map((item) => {
		return item.id === id ? targetSelector : item;
	});

	// Remap trendline colors based on what is now active
	let activeCount = 0;
	allData.map((item) => {
		if (item.active) {
			item.color = trendlineConfig.trendlineColors[activeCount];
			activeCount++;
		}

		return item;
	});

	let newDatasets = [];
	allData.forEach((item) => {
		if (item.active) {
			const newDataset = {
				label: item.name,
				data: item.values,
				borderColor: item.color,
				backgroundColor: item.color,
			};

			newDatasets.push(newDataset);
		}
	});

	const newVisualizedData = {
		labels: allData[0].labels,
		datasets: newDatasets,
	};

	return {
		newAllData: allData,
		newVisualizedData: newVisualizedData,
		newActiveTrendlines: activeTrendlines,
	};
};

module.exports = {
	UpdateNewActiveTrendlines,
};
