var express = require("express");
var router = express.Router();
const detailController = require("../controllers/detailController.js");

// GET request for Details page
router.get("/", detailController.DetailPage);

router.get("/:id?/:type?",detailController.getDetails)

module.exports = router;