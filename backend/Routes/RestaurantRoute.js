const express = require("express");
const { getRestaurent } = require("../Controller/RestaurentController");

const router = express.Router();

router.get("/",getRestaurent)
module.exports = router;
