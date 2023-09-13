const express = require('express');
const router = express.Router();
const { getMeals, createMeal} = require('../controllers/meals');
const { validatorCreateMeal} = require('../validators/meals');

router.get("/", getMeals);
router.post("/", validatorCreateMeal, createMeal);



module.exports = router;