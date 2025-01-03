const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const BookingRoute = require("./Routes/BookindRoute");
const RestaurantRoute = require("./Routes/RestaurantRoute");

require("./config/db");
require("dotenv").config();

app.use(bodyParser.json());
app.use(cors());

app.use("/booking", BookingRoute);
app.use("/restaurent", RestaurantRoute);

app.get("/", (req, res) => {
  res.send("Hello, Vercel!");
});

module.exports = app;
