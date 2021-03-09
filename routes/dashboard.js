var express = require("express");
var router = express.Router();
const dashController = require("../controllers/dashController.js");

// GET request for Dashboard page
router.get("/", dashController.DashPage);

//group by which type ?
router.get("/:by",dashController.getGroups)

module.exports = router;
