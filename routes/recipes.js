const express = require("express");
const router = express.Router();
const {
  createRecipe,
  getRecipes,
  getRecipe,
} = require("../controllers/recipes");

router.get("/", getRecipes);
router.get("/recipes/:id", getRecipe);
router.post("/", createRecipe);

module.exports = router;
