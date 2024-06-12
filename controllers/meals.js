const { mealModel, foodModel } = require("../models");
const { handleHttpError } = require("../utils/handleErrors");
const jwt = require("jsonwebtoken");

/* const getMeals = async (req, res) => {
  try {
    const user = req.user;
    const data = await mealModel.find({});
    res.send({ data, user });
  } catch (e) {
    handleHttpError(res, "ERROR_GET_MEALS", 500);
  }
}; */

function calculateNutritionalInformation(meal) {
  let totalCalories = 0;
  let totalFats = 0;
  let totalCarbs = 0;
  let totalProteins = 0;
  meal.foods.forEach((food) => {
    let caloriesPerFood = Math.round(
      food.weightConsumed * (food.foodId.calories / food.foodId.weight)
    );
    let fatsPerFood = Math.round(
      food.weightConsumed * (food.foodId.fats / food.foodId.weight)
    );
    let carbsPerFood = Math.round(
      food.weightConsumed * (food.foodId.carbs / food.foodId.weight)
    );
    let proteinsPerFood = Math.round(
      food.weightConsumed * (food.foodId.proteins / food.foodId.weight)
    );
    food.caloriesPerFood = caloriesPerFood;
    food.fatsPerFood = fatsPerFood;
    food.carbsPerFood = carbsPerFood;
    food.proteinsPerFood = proteinsPerFood;
    totalCalories += caloriesPerFood;
    totalFats += fatsPerFood;
    totalCarbs += carbsPerFood;
    totalProteins = +proteinsPerFood;
  });
  meal.totalCalories = totalCalories;
  meal.totalFats = totalFats;
  meal.totalCarbs = totalCarbs;
  meal.totalProteins = totalProteins;
  return meal;
}

const getMealsByUserId = async (req, res) => {
  try {
    const userId = req.userId;

    // Añadir un log para verificar userId
    console.log(`Fetching meals for userId: ${userId}`);

    const data = await mealModel
      .find({ userId: userId })
      .select("-userId")
      .populate({
        path: "foods.foodId",
      })
      .exec();

    // Añadir un log para verificar los datos obtenidos
    //console.log("Meals found:", data);
    data.forEach((meal) => {
      console.log(meal);
    });

    const meals = data.map((meal) => meal.toJSON());
    const mealsToSend = meals.map((meal) =>
      calculateNutritionalInformation(meal)
    );

    res.send({ data: mealsToSend });
  } catch (e) {
    // Añadir un log para verificar el error capturado
    console.error("Error fetching meals:", e);
    handleHttpError(res, "ERROR_GET_MEALS", 500);
  }
};

const getMealsByUserIdAndDate = async (req, res) => {
  try {
    const userId = req.userId;

    const filter = {
      userId: userId,
      date: {
        $gte: new Date(`${req.params.date}T00:00:00.000Z`),
        $lt: new Date(`${req.params.date}T23:59:59.999Z`),
      },
    };

    let data = await mealModel
      .find(filter)
      .select("-userId")
      .populate({
        path: "foods.foodId",
        populate: {
          path: "category",
        },
      })
      .exec();
    const meals = data.map((meal) => meal.toJSON());
    const mealsToSend = meals.map((meal) =>
      calculateNutritionalInformation(meal)
    );
    res.send({ mealsToSend });
  } catch (e) {
    handleHttpError(res, "ERROR_GET_MEALS", 500);
  }
};

const createMeal = async (req, res) => {
  try {
    // Accede al userId desde req.body
    const userId = req.userId;
    // Agrega el userId a los datos de la comida antes de crearla
    const mealData = { ...req.body, userId };
    const data = await mealModel.create(mealData);
    // Eliminar el userId de la respuesta
    const { userId: removedUserId, ...responseData } = data.toObject();
    //res.status(200).end();
    res.send({ data: responseData });
  } catch (e) {
    console.log(e);
    handleHttpError(res, "ERROR_CREATE_MEALS", 500);
  }
};

const updateMealById = async (req, res) => {
  try {
    const userId = req.userId;
    const mealId = req.params.id;

    // Primero, verificamos si la comida pertenece al usuario actual
    const meal = await mealModel.findOne({ _id: mealId, userId: userId });
    if (!meal) {
      return handleHttpError(res, "Meal not found or unauthorized", 404);
    }

    // Si la comida pertenece al usuario, procedemos a actualizarla
    const updatedMeal = await mealModel.findOneAndUpdate(
      { _id: mealId },
      req.body
    );

    // Eliminar el userId de la respuesta
    const { userId: removedUserId, ...responseData } = updatedMeal.toObject();

    res.send({ data: responseData });
  } catch (e) {
    handleHttpError(res, "ERROR_UPDATE_MEAL", 500);
  }
};

const deleteMealById = async (req, res) => {
  try {
    // Obtener el userId de la solicitud
    const userId = req.userId;
    // Obtener la meal por el _id
    const mealToDelete = await mealModel.findOne({ _id: req.params.id });
    // Verificar si la meal existe y si el userId coincide
    if (!mealToDelete || mealToDelete.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You don't have permission to delete this meal" });
    }

    // Borrar la meal si todo está bien
    const deletedMeal = await mealModel.deleteOne({ _id: req.params.id });

    res
      .status(200)
      .json({ message: "Meal successfully deleted", data: deletedMeal });
  } catch (e) {
    handleHttpError(res, "ERROR_DELETE_MEAL", 500);
  }
};

const getCaloriesByDays = async (req, res) => {
  try {
    const userId = req.userId;
    const startDate = new Date(req.params.startDate).toISOString();
    const endDate = new Date(req.params.endDate).toISOString();
    const filter = {
      userId: userId,
      date: { $gte: startDate, $lte: endDate },
    };

    const fechaFin = new Date(endDate);
    const fechasIntermedias = [];
    let fechaActual = new Date(startDate);

    while (fechaActual < fechaFin) {
      fechasIntermedias.push({
        date: fechaActual.toISOString(),
        totalCalories: 0,
      });

      fechaActual.setDate(fechaActual.getDate() + 1);
    }

    const meals = await mealModel
      .find(filter)
      .select("-userId")
      .populate({
        path: "foods.foodId",
      })
      .exec();
    const dataOfMeals = {};
    meals.forEach((item) => {
      const date = item.date.toISOString().split("T")[0];
      const meal = calculateNutritionalInformation(item);
      const calories = meal.totalCalories;

      if (dataOfMeals[date]) {
        dataOfMeals[date] += calories;
      } else {
        dataOfMeals[date] = calories;
      }
    });

    function obtenerFechaSinHora(date) {
      return date.split("T")[0];
    }

    // Recorre el segundo arreglo y actualiza el primero si encuentra una fecha coincidente (sin la hora)
    for (const date in dataOfMeals) {
      const calories = dataOfMeals[date];
      const fechaSinHora = obtenerFechaSinHora(date);
      const index = fechasIntermedias.findIndex(
        (item) => obtenerFechaSinHora(item.date) === fechaSinHora
      );
      if (index !== -1) {
        fechasIntermedias[index].totalCalories = calories;
      }
    }
    res.send({ fechasIntermedias });
  } catch (e) {
    handleHttpError(res, "ERROR_GET_CALORIES", 500);
  }
};

const getCaloriesBetweenDays = async (req, res) => {
  try {
    const userId = req.userId;
    const startDate = req.params.startDate;
    const endDate = req.params.endDate;

    const filter = {
      userId: userId,
      date: { $gte: startDate, $lte: endDate },
    };

    const result = await mealModel

      .find(filter)
      .select("-userId")
      .populate({
        path: "foods.foodId",
      })
      .exec();
    const meals = result.map((meal) => meal.toJSON());
    const mealsToSend = meals.map((meal) =>
      calculateNutritionalInformation(meal)
    );
    let totalCalorias = 0;
    mealsToSend.forEach((record) => {
      totalCalorias += record.totalCalories;
    });

    res.send({ totalCalorias });
  } catch (e) {
    handleHttpError(res, "ERROR_GET_CALORIES", 500);
  }
};

module.exports = {
  createMeal,
  getMealsByUserId,
  getMealsByUserIdAndDate,
  updateMealById,
  deleteMealById,
  getCaloriesBetweenDays,
  getCaloriesByDays,
  calculateNutritionalInformation,
};
