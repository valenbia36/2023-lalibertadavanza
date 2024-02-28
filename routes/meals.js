const express = require("express");
const router = express.Router();
const { verifyToken } = require("../utils/handleJWT");
const {
  createMeal,
  getMealsByUserId,
  getMealsByUserIdAndDate,
  updateMealById,
  deleteMealById,
  getCaloriesBetweenDays,
  getCaloriesByDays,
} = require("../controllers/meals");
const { validatorCreateMeal } = require("../validators/meals");

router.get("/user/:id", verifyToken, getMealsByUserId);
router.get("/user/:id/date/:date", verifyToken, getMealsByUserIdAndDate);
router.post("/", verifyToken, validatorCreateMeal, createMeal);
router.put("/:id", verifyToken, updateMealById);
router.delete("/:id", verifyToken, deleteMealById);
router.get(
  "/user/:id/between/:startDate/:endDate",
  verifyToken,
  getCaloriesByDays
);
router.get(
  "/user/:id/startDate/:startDate/endDate/:endDate",
  verifyToken,
  getCaloriesBetweenDays
);

module.exports = router;
