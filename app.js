require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dbConnect = require('./config/mongo');
const app = express();

const NODE_ENV = process.env.NODE_ENV || 'development';

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;

app.use("/api", require("./routes"));

if(NODE_ENV !== 'test'){
  app.listen(port);
}

dbConnect();

module.exports = app;