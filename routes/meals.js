const express = require('express');
const router = express.Router();
const { getMeals, createMeal, getMealsByUserId } = require('../controllers/meals');
const { validatorCreateMeal} = require('../validators/meals');

router.get("/", getMeals);
router.get("/user/:id", getMealsByUserId);
router.post("/", validatorCreateMeal, createMeal);

module.exports = router;