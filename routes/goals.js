const express = require("express");
const router = express.Router();
const {
  getGoalsByUserId,
  createGoal,
  updateGoal,
  deleteGoal,
  getActiveGoalsByUserId,
  getGoalsByUserWithProgress
} = require("../controllers/goals");

router.get("/:userId", getGoalsByUserId);
router.get("/activeGoals/:userId", getActiveGoalsByUserId);
router.get("/goalsWithProgress/:userId",getGoalsByUserWithProgress)
router.post("/", createGoal);
router.put("/:goalId", updateGoal);
router.delete("/:goalId", deleteGoal);

module.exports = router;
