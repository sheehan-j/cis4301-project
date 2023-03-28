const oracledb = require("oracledb");
const executeQuery = require("../util/executeQuery");

exports.getTest = async (req, res) => {
	console.log("GET TEST");
	try {
		const result = await executeQuery("SELECT * FROM test");
		return res.status(200).json(result);
	} catch (err) {
		return res.status(400).json({ message: err.message });
	}
};
