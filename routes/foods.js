const express = require("express");
const router = express.Router();
const {
  getFoods,
  createFood,
  getFoodsByCategory,
} = require("../controllers/foods");
const { validatorCreateFood } = require("../validators/foods");
//const authMiddleware = require('../middleware/sessionMiddleware');
//const checkRol = require('../middleware/role');

router.get("/", getFoods);
router.get("/category/:categoryName", getFoodsByCategory);
router.post("/", validatorCreateFood, createFood);

module.exports = router;
