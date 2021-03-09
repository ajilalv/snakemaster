/* ------> DashBoard Controller */
const mysql = require("../models/sql.js");

exports.DashPage = function(req, res, next) {
  res.render("dashboard");
};

exports.getGroups = function(req, res, next) {
  mysql.getGroups(req.params.by, groups => {
    res.send(groups);
  });
};
