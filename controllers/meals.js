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
    const year = 2023;
    const month = req.params.month;

    const regexPattern = new RegExp(
      `^${year}-${month.toString().padStart(2, "0")}-`
    );

    const meals = await mealModel.find({
      userId: userId,
      date: {
        $regex: regexPattern,
      },
    });

    const data = {};
    meals.forEach((item) => {
      const date = item.date.substring(8, 10);
      const calories = item.calories;

      if (data[date]) {
        data[date] += calories;
      } else {
        data[date] = calories;
      }
    });

    const result = Object.entries(data).map(([date, calories]) => ({
      date,
      calorias: calories,
    }));

    result.sort((a, b) => {
      const dateA = parseInt(a.date, 10);
      const dateB = parseInt(b.date, 10);

      return dateA - dateB;
    });
    const caloriesMap = {};
    result.forEach((item) => {
      caloriesMap[item.date] = item.calorias;
    });

    const daysInMonth = new Date(2023, month, 0).getDate();
    const resultWithAllDays = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = day.toString().padStart(2, "0");
      const calories = caloriesMap[date] || 0;
      resultWithAllDays.push({ date, calorias: calories });
    }
    res.send({ resultWithAllDays });
  } catch (e) {
    console.log(e);
    handleHttpError(res, "ERROR_GET_CALORIES", 500);
  }
};

const getCaloriesBetweenDays = async (req, res) => {
  try {
    const userId = req.params.id;
    const startDate = req.params.startDate;
    const endDate = req.params.endDate;
    const filter = {
      userId: userId,
      date: { $gte: startDate, $lte: endDate },
    };

    const result = await mealModel.find(filter);

    let totalCalorias = 0;
    result.forEach((record) => {
      totalCalorias += record.calories;
    });

    res.send({ totalCalorias });
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
  getCaloriesBetweenDays,
};
