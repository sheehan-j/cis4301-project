const express = require("express");
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 8089;
const app = express();
const router = express.Router();
const morgan = require("morgan");
require("dotenv").config();

const testsController = require("./controllers/testsController");

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
router.route("/test/").get(testsController.getTest);
// Start server
app.use(express.static("static"));
app.use("/api", router);
app.listen(PORT);
