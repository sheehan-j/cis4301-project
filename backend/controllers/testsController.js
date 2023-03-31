const executeQuery = require("../util/executeQuery");
const translateLabels = require("../util/translateLabels");

exports.getTest = async (req, res) => {
	try {
		const result = await executeQuery(`
      SELECT month, SUM(deaths) as deaths
      FROM JORDANSHEEHAN.Deaths
      WHERE condition = 3
      AND year = 2021
      AND state = 40
      GROUP BY month
    `);

		// Capture the values and labels of each record into lists
		const values = [];
		result.map((item) => {
			values.push(item.DEATHS);
		});
		const labels = [];
		result.map((item) => {
			labels.push(item.MONTH);
		});

		// Translate month numbers into text
		const translatedLabels = translateLabels(labels);

		// Create new object
		const data = {
			labels: translatedLabels,
			values: values,
		};

		return res.status(200).json(data);
	} catch (err) {
		return res.status(400).json({ message: err.message });
	}
};
