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
  getCaloriesBetweenDays
} = require("../controllers/meals");
const { validatorCreateMeal } = require("../validators/meals");

router.get("/", getMeals);
router.get("/user/:id", getMealsByUserId);
router.get("/user/:id/date/:date", getMealsByUserIdAndDate);
router.post("/", validatorCreateMeal, createMeal);
router.put("/:id", updateMealById);
router.delete("/:id", deleteMealById);
router.get("/user/:id/month/:month", getCaloriesByMonth);
router.get("/user/:id/startDate/:startDate/endDate/:endDate",getCaloriesBetweenDays)

module.exports = router;
