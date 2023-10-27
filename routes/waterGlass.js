const express = require('express');
const router = express.Router();
const { createWaterGlass, getWaterGlassByUserId, getWaterGlassForUserIdByDay } = require('../controllers/waterGlass')

router.post("/", createWaterGlass);
router.get("/:userId", getWaterGlassByUserId);
router.get("/countByDay/:userId", getWaterGlassForUserIdByDay);

module.exports = router;