const express = require("express");
const bodyParser = require("body-parser");

//Routes
var indexRouter = require("./routes/index.js");
var dashRouter = require("./routes/dashboard.js");
var detailRouter = require("./routes/details.js");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs"); // set the view engine to ejs

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/", indexRouter);
app.use("/dashboard", dashRouter);
app.use("/details", detailRouter);

// listen for requests :)
var listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});
