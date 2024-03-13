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
const extractUserIdMiddleware = require("../utils/handleUserID");

router.get("/user/", verifyToken, extractUserIdMiddleware, getMealsByUserId);
router.get(
  "/user/date/:date",
  extractUserIdMiddleware,
  verifyToken,
  getMealsByUserIdAndDate
);
router.post("/", verifyToken, extractUserIdMiddleware, createMeal);
router.put("/:id", verifyToken, extractUserIdMiddleware, updateMealById);
router.delete("/:id", verifyToken, extractUserIdMiddleware, deleteMealById);
router.get(
  "/user/between/:startDate/:endDate",
  extractUserIdMiddleware,
  verifyToken,
  getCaloriesByDays
);
router.get(
  "/user/startDate/:startDate/endDate/:endDate",
  extractUserIdMiddleware,
  verifyToken,
  getCaloriesBetweenDays
);

module.exports = router;
