require("dotenv").config();
const express = require("express");
const cors = require("cors");
const dbConnect = require("./config/mongo");
const bodyParser = require("body-parser");
const app = express();

const NODE_ENV = process.env.NODE_ENV || "development";
if (process.env.TZ) {
  process.env.TZ = process.env.TZ;
}

app.use(cors());
app.use(express.json());
app.use(bodyParser.json({ limit: "50mb" }));

const port = process.env.PORT || 3000;

app.use("/api", require("./routes"));

if (NODE_ENV !== "test") {
  app.listen(port);
}

dbConnect();

module.exports = app;
