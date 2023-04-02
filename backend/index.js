const express = require("express");
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 8089;
const app = express();
const router = express.Router();
const morgan = require("morgan");
require("dotenv").config();

const avgByAgeController = require("./controllers/avgByAgeController");
const avgByStateController = require("./controllers/avgByStateController");
const avgByConditionController = require("./controllers/avgByConditionController");
const avgByConditionGroupController = require("./controllers/avgByConditionGroupController");

// Configure middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: "*/*" }));
app.use(morgan("dev"));

// Configure allowed options for router
router.use(function (req, res, next) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
	res.setHeader(
		"Access-Control-Allow-Headers",
		"X-Requested-With,content-type"
	);
	res.setHeader("Access-Control-Allow-Credentials", true);
	next();
});

// Routes
router
	.route("/age-group/monthly/:min/:max")
	.get(avgByAgeController.getAgeGroupDataMonthly);
router
	.route("/age-group/yearly/:min/:max")
	.get(avgByAgeController.getAgeGroupDataYearly);
router
	.route("/condition/monthly/:min/:max")
	.get(avgByConditionController.getConditionDataMonthly);
router
	.route("/condition/yearly/:min/:max")
	.get(avgByConditionController.getConditionDataYearly);
router
	.route("/condition-group/monthly/:min/:max")
	.get(avgByConditionGroupController.getConditionGroupDataMonthly);
router
	.route("/condition-group/yearly/:min/:max")
	.get(avgByConditionGroupController.getConditionGroupDataYearly);
router
	.route("/state/monthly/:min/:max")
	.get(avgByStateController.getStateDataMonthly);
router
	.route("/state/yearly/:min/:max")
	.get(avgByStateController.getStateDataYearly);

// Start server
app.use(express.static("static"));
app.use("/api", router);
console.log(`Server starting on port ${PORT}...`);
app.listen(PORT);
