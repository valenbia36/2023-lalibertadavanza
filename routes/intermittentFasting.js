const express = require('express');
const router = express.Router();
const { createIntermittentFasting, getIntermittentFastingByUserId, getActiveIntermittentFastingByUserId } = require('../controllers/intermittentFasting')

router.post("/", createIntermittentFasting);
router.get("/:userId", getIntermittentFastingByUserId);
router.get("/active/:userId", getActiveIntermittentFastingByUserId);

module.exports = router;