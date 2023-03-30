require("dotenv").config();
const connConfig = {
	user: process.env.DBAAS_USER_NAME || "oracle",
	password: process.env.DBAAS_USER_PASSWORD || "oracle",
	connectString:
		process.env.DBAAS_DEFAULT_CONNECT_DESCRIPTOR || "localhost/xe",
};

module.exports = connConfig;
