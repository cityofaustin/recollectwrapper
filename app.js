const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

const index = require("./routes/index");

app.use(allowCrossDomain);
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", index);

module.exports = app;
