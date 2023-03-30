const oracledb = require("oracledb");
const connConfig = require("../config/connConfig");

const executeQuery = async (query) => {
	let conn;

	try {
		console.log(connConfig);
		conn = await oracledb.getConnection(connConfig);
		const result = await conn.execute(
			query,
			{},
			{
				outFormat: oracledb.OBJECT,
			}
		);
		return result.rows;
	} catch (err) {
		console.error(err);
		res.status(500).json("Error getting data from DB");
	} finally {
		if (conn) {
			await conn.close();
		}
	}
};

module.exports = executeQuery;
