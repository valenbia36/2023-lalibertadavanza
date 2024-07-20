const express = require("express");
const { weekModel, shoppingListModel } = require("../models");

async function createShoppingList(result) {
  // Buscar la semana con el plan de comidas del usuario
  const weeks = await weekModel
    .find({ userId: result.userId })
    .populate({
      path: "Monday.breakfast Monday.lunch Monday.snack Monday.dinner Tuesday.breakfast Tuesday.lunch Tuesday.snack Tuesday.dinner Wednesday.breakfast Wednesday.lunch Wednesday.snack Wednesday.dinner Thursday.breakfast Thursday.lunch Thursday.snack Thursday.dinner Friday.breakfast Friday.lunch Friday.snack Friday.dinner Saturday.breakfast Saturday.lunch Saturday.snack Saturday.dinner Sunday.breakfast Sunday.lunch Sunday.snack Sunday.dinner",
      populate: "foods.foodId",
    })
    .exec();

  // Estructura para almacenar los totales diarios por alimento
  const dailyTotalPerFood = {};
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // Procesar cada día de la semana
  for (const day of daysOfWeek) {
    const breakfast = weeks[0][day]?.breakfast;
    const lunch = weeks[0][day]?.lunch;
    const snack = weeks[0][day]?.snack;
    const dinner = weeks[0][day]?.dinner;

    const calculateTotalPerFood = (meal) => {
      if (weeks[0][day][meal] && weeks[0][day][meal].foods) {
        const foods = weeks[0][day][meal].foods;
        foods.forEach((food) => {
          if (!dailyTotalPerFood[food.foodId._id]) {
            dailyTotalPerFood[food.foodId._id] = 0;
          }

          dailyTotalPerFood[food.foodId._id] += food.weightConsumed;
        });
      }
    };

    // Calcular totales para cada comida
    calculateTotalPerFood("breakfast");
    calculateTotalPerFood("lunch");
    calculateTotalPerFood("snack");
    calculateTotalPerFood("dinner");
  }

  // Transformar los datos para la lista de compras
  const transformToShoppingList = (data) => {
    return Object.entries(data).map(([foodId, weightConsumed]) => ({
      foodId: foodId,
      weightConsumed,
      quantityToBuy: 0, // Valor por defecto
    }));
  };

  const weeklyTotal = transformToShoppingList(dailyTotalPerFood);

  // Buscar la lista de compras existente
  const existingShoppingList = await shoppingListModel
    .findOne({ user: result.userId })
    .exec();

  if (existingShoppingList) {
    // Mapeo de la lista existente por ID de alimento
    const existingItemsMap = existingShoppingList.weeklyTotal.reduce(
      (map, item) => {
        map[item.foodId.toString()] = item;
        return map;
      },
      {}
    );

    // Actualizar la lista de compras existente
    const updatedWeeklyTotal = weeklyTotal.map((newItem) => {
      const existingItem = existingItemsMap[newItem.foodId.toString()];

      if (existingItem) {
        // Actualizar weightConsumed y verificar quantityToBuy
        const updatedItem = {
          ...existingItem,
          weightConsumed: newItem.weightConsumed, // Actualizar weightConsumed
          quantityToBuy: existingItem.quantityToBuy, // Mantener quantityToBuy
        };
        // Ajustar quantityToBuy si es mayor que weightConsumed
        if (updatedItem.quantityToBuy > updatedItem.weightConsumed) {
          updatedItem.quantityToBuy = updatedItem.weightConsumed;
        }
        return updatedItem;
      } else {
        // Si el alimento no estaba en la lista existente, añadirlo
        return newItem;
      }
    });

    // Guardar los cambios en la lista de compras
    existingShoppingList.weeklyTotal = updatedWeeklyTotal;
    await existingShoppingList.save();
  } else {
    // Crear una nueva lista de compras si no existe
    const shoppingList = new shoppingListModel({
      user: result.userId,
      weeklyTotal: weeklyTotal,
    });
    await shoppingList.save();
  }
}

const getWeek = async (req, res) => {
  try {
    const userId = req.userId;
    const weeks = await weekModel
      .find({ userId: userId })
      .populate({
        path: "Monday.breakfast Monday.lunch Monday.snack Monday.dinner Tuesday.breakfast Tuesday.lunch Tuesday.snack Tuesday.dinner Wednesday.breakfast Wednesday.lunch Wednesday.snack Wednesday.dinner Thursday.breakfast Thursday.lunch Thursday.snack Thursday.dinner Friday.breakfast Friday.lunch Friday.snack Friday.dinner Saturday.breakfast Saturday.lunch Saturday.snack Saturday.dinner Sunday.breakfast Sunday.lunch Sunday.snack Sunday.dinner",
      })
      .exec();
    const weeksWithLastUpdate = weeks.map((week) => ({
      ...week.toObject(),
      lastUpdate: week.updatedAt,
    }));

    res.status(200).json(weeksWithLastUpdate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const saveWeek = async (req, res) => {
  try {
    const updatedPlan = req.body;
    const userId = req.userId;
    /* if (!updatedPlan.userId) {
      return res
        .status(400)
        .json({ success: false, error: "El userId es obligatorio." });
    } */
    if (req.user._id != userId) {
      return handleHttpError(res, "UNAUTHORIZED", 403);
    }

    const result = await weekModel.findOneAndUpdate(
      { userId: userId },
      updatedPlan,
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );
    const shoppingList = await createShoppingList(result);

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: "ERROR_PLAN_UPDATE" });
  }
};

module.exports = {
  getWeek,
  saveWeek,
};
