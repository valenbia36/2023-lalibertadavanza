const express = require("express");
const router = express.Router();
const {
  getGoalsByUserId,
  createGoal,
  updateGoal,
  deleteGoal,
  getActiveGoalsByUserId,
} = require("../controllers/goals");

router.get("/:userId", getGoalsByUserId);
router.get("/activeGoals/:userId", getActiveGoalsByUserId);
router.post("/", createGoal);
router.put("/:goalId", updateGoal);
router.delete("/:goalId", deleteGoal);

module.exports = router;
