const express = require("express");
const router = express.Router();
const { verifyToken } = require("../utils/handleJWT");
const {
  createRecipe,
  getRecipes,
  getRecipe,
  addRateToRecipe,
  updateRecipeById,
} = require("../controllers/recipes");

router.get("/", verifyToken, getRecipes);
router.get("/recipes/:id", verifyToken, getRecipe);
router.post("/", verifyToken, createRecipe);
router.put("/rate/:id", verifyToken, addRateToRecipe);
router.put("/:id", verifyToken, updateRecipeById);

module.exports = router;
