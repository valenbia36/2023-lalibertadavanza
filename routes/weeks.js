const express = require("express");
const router = express.Router();
const { getWeek, saveWeek } = require("../controllers/weeks");
const { verifyToken } = require("../utils/handleJWT");

router.get("/:id", verifyToken, getWeek);
router.put("/", verifyToken, saveWeek);

module.exports = router;
