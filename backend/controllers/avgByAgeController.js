const executeQuery = require("../util/executeQuery");
const translateLabels = require("../util/translateLabels");
const reformatData = require("../util/reformatData");

exports.getAgeGroupDataMonthly = async (req, res) => {
	try {
		// Monthly dates are formatted like "3_2020", split
		// them apart to get year and month individually
		const minDateParts = req.params.min.split("_");
		const maxDateParts = req.params.max.split("_");

		// Format the date range WHERE clause based on the years
		let dateRangeClause;
		if (minDateParts[1] === maxDateParts[1]) {
			dateRangeClause = `
          WHERE 
            (year = ${minDateParts[1]})
            AND
            (month >= ${minDateParts[0]})
            AND
            (month <= ${maxDateParts[0]})
        `;
		} else if (
			parseInt(minDateParts[1]) ===
			parseInt(maxDateParts[1]) + 1
		) {
			dateRangeClause = `
          WHERE 
            (year = ${minDateParts[1]} AND month >= ${minDateParts[0]})
            OR
            (year = ${maxDateParts[1]} AND month <= ${maxDateParts[0]})
        `;
		} else {
			dateRangeClause = `
          WHERE 
            (year = ${minDateParts[1]} AND month >= ${minDateParts[0]})
            OR 
            (year > ${minDateParts[1]} AND year < ${maxDateParts[1]})
            OR
            (year = ${maxDateParts[1]} AND month <= ${maxDateParts[0]})
        `;
		}

		const queryResult = await executeQuery(`
      SELECT 
        year, 
        month, 
        age_group, 
        AVG(deaths) as deaths
      FROM JORDANSHEEHAN.Deaths
      ${dateRangeClause}
      GROUP BY year, month, age_group
      ORDER BY year, age_group, month
		`);

		const ageGroups = await executeQuery(`
      SELECT DISTINCT age_group
      FROM JORDANSHEEHAN.Deaths
      ORDER BY age_group
    `);

		const result = await reformatData(
			queryResult,
			ageGroups,
			"AGE_GROUP",
			"MONTH",
			"DEATHS"
		);

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

		const result = await reformatData(
			queryResult,
			ageGroups,
			"AGE_GROUP",
			"YEAR",
			"DEATHS"
		);

		return res.status(200).json(result);
	} catch (err) {
		console.error(err);
		return res.status(400).json({ message: err.message });
	}
};
