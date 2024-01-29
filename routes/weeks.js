const express = require("express");
const router = express.Router();
const { getWeek, saveWeek } = require("../controllers/weeks");

router.get("/:id", getWeek);
router.put("/", saveWeek);

module.exports = router;
