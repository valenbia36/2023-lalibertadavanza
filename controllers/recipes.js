const { recipeModel, usersModel } = require("../models");
const { eventNames } = require("../models/users");
const { handleHttpError } = require("../utils/handleErrors");

const createRecipe = async (req, res) => {
  try {
    const name = req.body.name;
    const ingredients = req.body.foods;
    const steps = req.body.steps;
    const creatorId = req.body.userId;

    const data = await recipeModel.create({
      name: name,
      ingredients: ingredients,
      steps: steps,
      creator: creatorId,
    });

    res.send({ data });
  } catch (e) {
    console.error("Error in createRecipe:", e);
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
    handleHttpError(res, "ERROR_GET_RECIPES", 500);
  }
};

const addRateToRecipe = async (req, res) => {
  try {
    console.log(req.body);
    const data = await recipeModel.findById(req.body.id);
    if (!data) {
      console.log("ERROR_RECIPE_NOT_FOUND");
      return handleHttpError(res, "ERROR_RECIPE_NOT_FOUND", 404);
    }
    console.log(data);

    // Verificar si el usuario ya calificó esta receta
    if (data.ratings.some((rate) => rate.userId === req.body.userId)) {
      return handleHttpError(res, "ERROR_ALREADY_RATED", 400);
    }

    /* if (!Array.isArray(data.ratings)) {
      data.ratings = [];
    } */
    // Agregar la calificación junto con el ID del usuario
    data.ratings.push({ rate: req.body.rate, userId: req.body.userId });

    await data.save();

    res.send({ data });
  } catch (e) {
    handleHttpError(res, "ERROR_ADD_RATE", 500);
  }
};

module.exports = {
  getRecipe,
  getRecipes,
  createRecipe,
  addRateToRecipe,
};
