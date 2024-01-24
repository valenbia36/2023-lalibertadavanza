const express = require("express");
const router = express.Router();
const {
  createRecipe,
  getRecipes,
  getRecipe,
  addRateToRecipe,
} = require("../controllers/recipes");

router.get("/", getRecipes);
router.get("/recipes/:id", getRecipe);
router.post("/", createRecipe);
router.post("/rate/:id", addRateToRecipe);

module.exports = router;
