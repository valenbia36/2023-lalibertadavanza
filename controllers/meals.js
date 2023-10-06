const { mealModel } = require("../models");
const { handleHttpError } = require("../utils/handleErrors");

const getMeals = async (req, res) => {
  try {
    const user = req.user;
    const data = await mealModel.find({});
    res.send({ data, user });
  } catch (e) {
    handleHttpError(res, "ERROR_GET_MEALS", 500);
  }
};

const getMealsByUserId = async (req, res) => {
  try {
    const user = req.user;
    const data = await mealModel.find({ userId: req.params.id });
    res.send({ data, user });
  } catch (e) {
    handleHttpError(res, "ERROR_GET_MEALS", 500);
  }
};

const getMealsByUserIdAndDate = async (req, res) => {
  try {
    const user = req.user;

    // Construye una expresión regular para buscar la fecha en el formato "YYYY-MM-DD"
    const date = new RegExp(`^${req.params.date}`);

    const filter = {
      userId: req.params.id,
      date: { $regex: date },
    };

    const data = await mealModel.find(filter);
    res.send({ data, user });
  } catch (e) {
    handleHttpError(res, "ERROR_GET_MEALS", 500);
  }
};

const createMeal = async (req, res) => {
  try {
    const data = await mealModel.create(req.body);
    res.send({ data });
  } catch (e) {
    handleHttpError(res, "ERROR_CREATE_MEALS", 500);
  }
};

const updateMealById = async (req, res) => {
  try {
    const data = await mealModel.findOneAndUpdate(
      { _id: req.params.id },
      req.body
    );
    res.send({ data });
  } catch (e) {
    handleHttpError(res, "ERROR_UPDATE_MEAL", 500);
  }
};

const deleteMealById = async (req, res) => {
  try {
    const data = await mealModel.delete({ _id: req.params.id });
    res.send({ data });
  } catch (e) {
    handleHttpError(res, "ERROR_DELETE_MEAL", 500);
  }
};

const getCaloriesByMonth = async (req, res) => {
  try {
    const userId = req.params.id;
    // Año y mes específicos
    const year = 2023;
    const month = req.params.month; // 1 para enero, 2 para febrero, 3 para marzo, etc.

    // Crear una expresión regular para buscar fechas que coincidan con el año y mes específicos
    const regexPattern = new RegExp(
      `^${year}-${month.toString().padStart(2, "0")}-`
    );

    const meals = await mealModel.find({
      date: {
        $regex: regexPattern,
      },
    });
    const caloriesByDay = {};

    meals.forEach((meal) => {
      const mealDate = meal.date; // Extract the date portion
      if (!caloriesByDay[mealDate]) {
        caloriesByDay[mealDate] = 0;
      }
      caloriesByDay[mealDate] += meal.calories;
    });
    //res.json({ totalCalories });
    res.send({ caloriesByDay });
  } catch (e) {
    console.log(e);
    handleHttpError(res, "ERROR_GET_CALORIES", 500);
  }
};

module.exports = {
  getMeals,
  createMeal,
  getMealsByUserId,
  getMealsByUserIdAndDate,
  updateMealById,
  deleteMealById,
  getCaloriesByMonth,
};
