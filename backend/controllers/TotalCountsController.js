const executeQuery = require("../util/executeQuery");

exports.getTotalTupleCounts = async (req, res) => {
	try {
		const deathTuples = await executeQuery(`
      SELECT COUNT(*) as count
      FROM JORDANSHEEHAN.Deaths
    `);

		const stateTuples = await executeQuery(`
      SELECT COUNT(*) as count
      FROM JORDANSHEEHAN.State
    `);

		const conditionGroupTuples = await executeQuery(`
      SELECT COUNT(*) as count
      FROM JORDANSHEEHAN.ConditionGroup
    `);

		const conditionTuples = await executeQuery(`
      SELECT COUNT(*) as count
      FROM JORDANSHEEHAN.Condition
    `);

		const total =
			parseInt(deathTuples[0].COUNT) +
			parseInt(stateTuples[0].COUNT) +
			parseInt(conditionGroupTuples[0].COUNT) +
			parseInt(conditionTuples[0].COUNT);

		return res.status(200).json(total);
	} catch (err) {
		console.error(err);
		res.status(400).json({ error: err.message });
	}
};
