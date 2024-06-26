const express = require("express");
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 8089;
const app = express();
const router = express.Router();
const morgan = require("morgan");
require("dotenv").config();

const AvgByAgeController = require("./controllers/avgByAgeController");
const AvgByStateController = require("./controllers/avgByStateController");
const AvgByRegionController = require("./controllers/avgByRegionController");
const AvgByConditionController = require("./controllers/avgByConditionController");
const AvgByConditionGroupController = require("./controllers/avgByConditionGroupController");
const TotalCountsController = require("./controllers/TotalCountsController");
const DiffController = require("./controllers/DiffController");
const MinMaxController = require("./controllers/MinMaxController");
const ProportionController = require("./controllers/ProportionController");

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
// Average routes
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
router
  .route("/region/monthly/:min/:max")
  .get(AvgByRegionController.getRegionDataMonthly);
router
    .route("/region/yearly/:min/:max")
    .get(AvgByRegionController.getRegionDataYearly);

// Diff routes
router
  .route("/difference/monthly/:group1/:group2/:min/:max")
  .get(DiffController.getDiffDataMonthly);
router
  .route("/difference/yearly/:group1/:group2/:min/:max")
  .get(DiffController.getDiffDataYearly);

// Min/max routes
router
  .route("/minmax/monthly/:type/:group/:min/:max")
  .get(MinMaxController.getMinMaxDataMonthly);
router
  .route("/minmax/yearly/:type/:group/:min/:max")
  .get(MinMaxController.getMinMaxDataYearly);

// Proportion routes
router
  .route("/proportion/monthly/:group/:min/:max")
  .get(ProportionController.getProportionDataMonthly);
router
  .route("/proportion/yearly/:group/:min/:max")
  .get(ProportionController.getProportionDataYearly);

// Route for getting total tuple count
router.route("/total-count").get(TotalCountsController.getTotalTupleCounts);

// Start server
app.use(express.static("static"));
app.use("/api", router);
console.log(`Server starting on port ${PORT}...`);
app.listen(PORT);
