const express = require("express");
const path = require("path");
const ejs = require("ejs");
const expressLayout = require("express-ejs-layouts");
const router = require("./routes/route");
const db = require("./app/database/connection");
var bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

const staticPath = path.join(__dirname, "public");
const resourcesPath = path.join(__dirname, "resources/views");
app.use(express.static(staticPath));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(expressLayout);
app.set("view engine", "ejs");
app.set("views", resourcesPath);
app.use(router);

app.listen(PORT, () => {
  console.log(`server listen at port no ${PORT}`);
});
