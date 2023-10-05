const express = require("express");
const router = express.Router();
const {
  getMeals,
  createMeal,
  getMealsByUserId,
  getMealsByUserIdAndDate,
  updateMealById,
  deleteMealById,
  getCaloriesByMonth,
} = require("../controllers/meals");
const { validatorCreateMeal } = require("../validators/meals");

router.get("/", getMeals);
router.get("/user/:id", getMealsByUserId);
router.get("/user/:id/date/:date", getMealsByUserIdAndDate);
router.post("/", validatorCreateMeal, createMeal);
router.put("/:id", updateMealById);
router.delete("/:id", deleteMealById);
router.get("/calories/:id", getCaloriesByMonth);

module.exports = router;
