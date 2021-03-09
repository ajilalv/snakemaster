/* ------> DashBoard Controller */
const mysql = require("../models/sql.js");

exports.DetailPage = function(req, res, next) {
  res.render("details");
};

exports.getDetails = function(req, res, next) {
  const id = req.params.id;
  const type = req.params.type;
  if (id && type) {
    mysql.getGroupDetails(id, type, result => {
      mysql.getGroupName(id, type, names => {
        res.send({ details: result, names: names });
      });
    });
  }
};
