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

    const data = {};
    meals.forEach(item => {
      const date = item.date.substring(8, 10); // Extraer el día de la fecha
      const calories = item.calories;
    
      // Si la fecha ya existe en el objeto, sumar las calorías
      if (data[date]) {
        data[date] += calories;
      } else {
        // Si la fecha no existe, crear una nueva entrada en el objeto
        data[date] = calories;
      }
    });
    
    // Convertir el objeto en un arreglo de objetos con el formato deseado
    const result = Object.entries(data).map(([date, calories]) => ({
      date,
      calorias: calories
    }));
    
    result.sort((a, b) => {
      const dateA = parseInt(a.date, 10);
      const dateB = parseInt(b.date, 10);
    
      return dateA - dateB;
    });
    const caloriesMap = {};
    result.forEach(item => {
      caloriesMap[item.date] = item.calorias;
    });
    
    // Crear un arreglo con todos los días del mes y establecer 0 para los que no estén presentes
    const daysInMonth = 31; // Cambia esto según el mes
    const resultWithAllDays = [];
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = day.toString().padStart(2, '0'); // Formato "dd"
      const calories = caloriesMap[date] || 0; // Establecer 0 si la fecha no está en el mapa
      resultWithAllDays.push({ date, calorias: calories });
    }
    res.send({ resultWithAllDays })
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
