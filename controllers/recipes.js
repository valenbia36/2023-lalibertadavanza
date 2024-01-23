const { recipeModel, usersModel } = require("../models");
const { handleHttpError } = require("../utils/handleErrors");

const createRecipe = async (req, res) => {
  try {
    const name = req.body.name;
    const ingredients = req.body.foods;
    //const steps = req.body.
    const creatorId = req.body.userId; // Suponiendo que tienes autenticación de usuario y pasas el usuario en el request

    const data = await recipeModel.create({
      name: name,
      ingredients: ingredients,
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
    console.log(data);
    res.send({ data });
  } catch (e) {
    handleHttpError(res, "ERROR_GET_RECIPES", 500);
  }
};

const getRecipe = async (req, res) => {
  try {
    // Fetch all recipes from the database
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
    const data = await recipeModel.findById(req.params.id);

    if (!data) {
      return handleHttpError(res, "ERROR_PARKING_NOT_FOUND", 404);
    }

    if (!Array.isArray(data.rating)) {
      data.rating = [];
    }

    data.rating.push(req.body.rate);

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
};
