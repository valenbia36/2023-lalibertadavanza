const { recipeModel, foodModel } = require("../models");
const { eventNames } = require("../models/users");
const { handleHttpError } = require("../utils/handleErrors");

const createRecipe = async (req, res) => {
  try {
    const name = req.body.name;
    const ingredients = req.body.foods;
    const steps = req.body.steps;
    const creatorId = req.userId;

    // Validar que cada elemento en el array 'ingredients' tenga el formato específico
    const isValidIngredients = ingredients.every((ingredient) => {
      const food = new foodModel(ingredient);
      return food.validateSync() === undefined;
    });

    if (!isValidIngredients) {
      // Si algún elemento en 'ingredients' no tiene el formato correcto, lanzar un error

      return handleHttpError(res, "ERROR_INVALID_INGREDIENTS_FORMAT", 400);
    }

    const data = await recipeModel.create({
      name: name,
      foods: ingredients,
      steps: steps,
      creator: creatorId,
    });
    res.send({ data });
  } catch (e) {
    handleHttpError(res, "ERROR_CREATE_RECIPE", 500);
  }
};
const getRecipes = async (req, res) => {
  try {
    const data = await recipeModel.find({});

    res.send({ data });
  } catch (e) {
    handleHttpError(res, "ERROR_GET_RECIPES", 500);
  }
};

const getRecipe = async (req, res) => {
  try {
    const recipe = await recipeModel
      .find()
      .populate("creador", "firstName lastName");

    res.status(200).json({ recipes });
  } catch (e) {
    handleHttpError(res, "ERROR_GET_RECIPE", 500);
  }
};

const addRateToRecipe = async (req, res) => {
  try {
    console.log(req.body.rate);
    const data = await recipeModel.findById(req.body.id);
    if (!data) {
      return handleHttpError(res, "ERROR_RECIPE_NOT_FOUND", 404);
    }

    // Verificar si el usuario ya califico esta receta
    if (data.ratings.some((rate) => rate.userId === req.body.userId)) {
      return handleHttpError(res, "ERROR_ALREADY_RATED", 400);
    }

    /* if (!Array.isArray(data.ratings)) {
      data.ratings = [];
    } */
    // Agregar la calificacion junto con el ID del usuario
    data.ratings.push({ rate: req.body.rate, userId: req.body.userId });

    await data.save();

    res.send({ data });
  } catch (e) {
    handleHttpError(res, "ERROR_ADD_RATE", 500);
  }
};
const updateRecipeById = async (req, res) => {
  try {
    if (req.user._id != req.body.creator) {
      return handleHttpError(res, "UNAUTHORIZED", 403);
    }
    const data = await recipeModel.findOneAndUpdate(
      { _id: req.params.id },
      req.body
    );
    res.send({ data });
  } catch (e) {
    handleHttpError(res, "ERROR_UPDATE_MEAL", 500);
  }
};

module.exports = {
  getRecipe,
  getRecipes,
  createRecipe,
  addRateToRecipe,
  updateRecipeById,
};
