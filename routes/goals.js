const express = require("express");
const router = express.Router();
const { getGoalsByUserId, createGoal } = require("../controllers/goals");

router.get("/:userId", getGoalsByUserId);
router.post("/", createGoal);

module.exports = router;
