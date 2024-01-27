const express = require("express");
const router = express.Router();
const { getWeek, getCurrentWeek, saveWeek } = require("../controllers/weeks");

router.get("/currentWeek", getCurrentWeek);
router.put("/", saveWeek);

module.exports = router;
