const express = require("express");
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 8089;
const app = express();
const router = express.Router();
const morgan = require("morgan");
require("dotenv").config();

const AvgByAgeController = require("./controllers/AvgByAgeController");
const AvgByStateController = require("./controllers/AvgByStateController");
const AvgByConditionController = require("./controllers/AvgByConditionController");
const AvgByConditionGroupController = require("./controllers/AvgByConditionGroupController");
const TotalCountsController = require("./controllers/TotalCountsController");
const DiffController = require("./controllers/DiffController");
const MaxController = require("./controllers/MaxController");

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
  .get(AvgByAgeController.getAgeGroupDataMonthly);
router
  .route("/age-group/yearly/:min/:max")
  .get(AvgByAgeController.getAgeGroupDataYearly);
router
  .route("/condition/monthly/:min/:max")
  .get(AvgByConditionController.getConditionDataMonthly);
router
  .route("/condition/yearly/:min/:max")
  .get(AvgByConditionController.getConditionDataYearly);
router
  .route("/condition-group/monthly/:min/:max")
  .get(AvgByConditionGroupController.getConditionGroupDataMonthly);
router
  .route("/condition-group/yearly/:min/:max")
  .get(AvgByConditionGroupController.getConditionGroupDataYearly);
router
  .route("/state/monthly/:min/:max")
  .get(AvgByStateController.getStateDataMonthly);
router
  .route("/state/yearly/:min/:max")
  .get(AvgByStateController.getStateDataYearly);

// TODO: Add yearly option for differnece
router
  .route("/difference/monthly/:group1/:group2/:min/:max")
  .get(DiffController.getDiffDataMonthly);

router
  .route("/max/monthly/:group/:min/:max")
  .get(MaxController.getMaxDataMonthly);
router
  .route("/max/yearly/:group/:min/:max")
  .get(MaxController.getMaxDataYearly);

router.route("/total-count").get(TotalCountsController.getTotalTupleCounts);

// Start server
app.use(express.static("static"));
app.use("/api", router);
console.log(`Server starting on port ${PORT}...`);
app.listen(PORT);
