const executeQuery = require("../util/executeQuery");
const translateLabels = require("../util/translateLabels");

exports.getAgeGroupDataMonthly = async (req, res) => {
	try {
		// Monthly dates are formatted like "3_2020", split
		// them apart to get year and month individually
		const minDateParts = req.params.min.split("_");
		const maxDateParts = req.params.max.split("_");

		const queryResult = await executeQuery(`
      SELECT 
        year, 
        month, 
        age_group, 
        AVG(deaths) as deaths
      FROM JORDANSHEEHAN.Deaths
      WHERE year >= ${minDateParts[1]}
      AND year <= ${maxDateParts[1]}
      AND month >= ${minDateParts[0]}
      AND month <= ${maxDateParts[0]}
      GROUP BY year, month, age_group
      ORDER BY year, age_group, month
		`);

		const ageGroups = await executeQuery(`
      SELECT DISTINCT age_group
      FROM JORDANSHEEHAN.Deaths
      ORDER BY age_group
    `);

		// Create a result object and add empty arrays for labels
		// and values that correspond to each group
		const tempArrays = {};
		ageGroups.map((item) => {
			tempArrays[item.AGE_GROUP] = {};
			tempArrays[item.AGE_GROUP]["labels"] = [];
			tempArrays[item.AGE_GROUP]["values"] = [];
		});

		// Add the labels and values to their respective groups
		queryResult.map((item) => {
			tempArrays[item.AGE_GROUP]["labels"].push(item.MONTH);
			tempArrays[item.AGE_GROUP]["values"].push(item.DEATHS);
		});

		const result = [];
		ageGroups.map((item) => {
			const newObject = {
				name: item.AGE_GROUP,
				labels: tempArrays[item.AGE_GROUP]["labels"],
				values: tempArrays[item.AGE_GROUP]["values"],
			};

			result.push(newObject);
		});

		// Translate month numbers into text labels
		result.map((item) => {
			item.labels = translateLabels(item.labels);
		});

		return res.status(200).json(result);
	} catch (err) {
		console.error(err);
		return res.status(400).json({ message: err.message });
	}
};

exports.getAgeGroupDataYearly = async (req, res) => {
	try {
		const queryResult = await executeQuery(`
      SELECT 
        year,  
        age_group, 
        AVG(deaths) as deaths
      FROM JORDANSHEEHAN.Deaths
      WHERE year >= ${req.params.min}
      AND year <= ${req.params.max}
      GROUP BY year, age_group
      ORDER BY year, age_group
		`);

		const ageGroups = await executeQuery(`
      SELECT DISTINCT age_group
      FROM JORDANSHEEHAN.Deaths
      ORDER BY age_group
    `);

		// Create a result object and add empty arrays for labels
		// and values that correspond to each group
		const tempArrays = {};
		ageGroups.map((item) => {
			tempArrays[item.AGE_GROUP] = {};
			tempArrays[item.AGE_GROUP]["labels"] = [];
			tempArrays[item.AGE_GROUP]["values"] = [];
		});

		// Add the labels and values to their respective groups
		queryResult.map((item) => {
			tempArrays[item.AGE_GROUP]["labels"].push(item.YEAR);
			tempArrays[item.AGE_GROUP]["values"].push(item.DEATHS);
		});

		const result = [];
		ageGroups.map((item) => {
			const newObject = {
				name: item.AGE_GROUP,
				labels: tempArrays[item.AGE_GROUP]["labels"],
				values: tempArrays[item.AGE_GROUP]["values"],
			};

			result.push(newObject);
		});

		return res.status(200).json(result);
	} catch (err) {
		console.error(err);
		return res.status(400).json({ message: err.message });
	}
};
