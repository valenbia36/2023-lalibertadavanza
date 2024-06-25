const express = require("express");
const router = express.Router();
const { getWeek, saveWeek } = require("../controllers/weeks");
const { verifyToken } = require("../utils/handleJWT");
const extractUserIdMiddleware = require("../utils/handleUserID");

router.get("/:id", verifyToken, extractUserIdMiddleware, getWeek);
router.put("/", verifyToken, extractUserIdMiddleware, saveWeek);

module.exports = router;
