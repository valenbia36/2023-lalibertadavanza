const express = require("express");
const router = express.Router();
const {
  createRecipe,
  getRecipes,
  getRecipe,
  addRateToRecipe,
  updateRecipeById
} = require("../controllers/recipes");

router.get("/", getRecipes);
router.get("/recipes/:id", getRecipe);
router.post("/", createRecipe);
router.put("/rate/:id", addRateToRecipe);
router.put("/:id", updateRecipeById);

module.exports = router;
