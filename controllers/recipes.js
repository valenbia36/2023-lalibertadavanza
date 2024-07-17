const { recipeModel, foodModel } = require("../models");
const { eventNames } = require("../models/users");
const { handleHttpError } = require("../utils/handleErrors");

const createRecipe = async (req, res) => {
  try {
    const creator = req.userId;
    const recipe = { ...req.body, creator };
    const data = await recipeModel.create(recipe);

    res.send({ data });
  } catch (e) {
    handleHttpError(res, "ERROR_CREATE_RECIPE", 500);
  }
};
const getRecipes = async (req, res) => {
  try {
    const data = await recipeModel
      .find({})
      .populate({
        path: "foods.foodId",
      })
      .exec();
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
    const data = await recipeModel.findById(req.body.id);
    if (!data) {
      return handleHttpError(res, "ERROR_RECIPE_NOT_FOUND", 404);
    }
    // Verificar si el usuario ya califico esta receta
    if (data.ratings.some((rate) => rate.userId.toString() === req.userId)) {
      return handleHttpError(res, "ERROR_ALREADY_RATED", 401);
    }

    /* if (!Array.isArray(data.ratings)) {
      data.ratings = [];
    } */
    // Agregar la calificacion junto con el ID del usuario
    data.ratings.push({ rate: req.body.rate, userId: req.userId });

    await data.save();

    res.send({ data });
  } catch (e) {
    handleHttpError(res, "ERROR_ADD_RATE", 500);
  }
};
const updateRecipeById = async (req, res) => {
  try {
    const info = {
      steps: req.body.steps,
      name: req.body.name,
      foods: req.body.foods,
    };
    const recipe = await recipeModel.findById({ _id: req.params.id });
    if (req.userId != recipe.creator.toString()) {
      return handleHttpError(res, "UNAUTHORIZED", 403);
    }

    // Validar que todos los pasos tengan texto
    const steps = recipe.steps;
    if (!steps.every((step) => step.text.trim().length > 0)) {
      return handleHttpError(res, "ALL_STEPS_MUST_HAVE_TEXT", 400);
    }

    const data = await recipeModel.findOneAndUpdate(
      { _id: req.params.id },
      info,
      { new: true }
    );
    res.send({ data });
  } catch (e) {
    console.log(e);
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
