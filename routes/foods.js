const express = require("express");
const router = express.Router();
const {
  getFoods,
  createFood,
  getFoodsByCategory,
} = require("../controllers/foods");
const { validatorCreateFood } = require("../validators/foods");
const { verifyToken } = require("../utils/handleJWT");
//const authMiddleware = require('../middleware/sessionMiddleware');
//const checkRol = require('../middleware/role');

router.get("/", verifyToken, getFoods);
router.get("/category/:categoryName", verifyToken, getFoodsByCategory);
router.post("/", validatorCreateFood, verifyToken, createFood);

module.exports = router;
