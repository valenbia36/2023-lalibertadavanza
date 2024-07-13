const express = require("express");
const { weekModel, shoppingListModel } = require("../models");

async function createShoppingList(result) {
  const weeks = await weekModel
    .find({ userId: result.userId })
    .populate({
      path: "Monday.breakfast Monday.lunch Monday.snack Monday.dinner Tuesday.breakfast Tuesday.lunch Tuesday.snack Tuesday.dinner Wednesday.breakfast Wednesday.lunch Wednesday.snack Wednesday.dinner Thursday.breakfast Thursday.lunch Thursday.snack Thursday.dinner Friday.breakfast Friday.lunch Friday.snack Friday.dinner Saturday.breakfast Saturday.lunch Saturday.snack Saturday.dinner Sunday.breakfast Sunday.lunch Sunday.snack Sunday.dinner",
      populate: "foods.foodId",
    })
    .exec();
  const weeksWithLastUpdate = weeks.map((week) => ({
    ...week.toObject(),
    lastUpdate: week.updatedAt,
  }));
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
  const shoppingListData = {};
  for (const day of daysOfWeek) {
    const breakfast = weeks[0][day]?.breakfast;
    const lunch = weeks[0][day]?.lunch;
    const snack = weeks[0][day]?.snack;
    const dinner = weeks[0][day]?.dinner;

    shoppingListData[day] = {};

    const calculateTotalPerFood = (meal) => {
      if (weeks[0][day][meal] && weeks[0][day][meal].foods) {
        const foods = weeks[0][day][meal].foods;
        foods.forEach((food) => {
          if (!dailyTotalPerFood[food.foodId._id]) {
            console.log(food.foodId);
            dailyTotalPerFood[food.foodId._id] = 0;
          }

          dailyTotalPerFood[food.foodId._id] += food.weightConsumed;

          if (!shoppingListData[day][meal]) {
            shoppingListData[day][meal] = [];
          }
          shoppingListData[day][meal].push(food);
        });
      }
    };

    calculateTotalPerFood("breakfast");
    calculateTotalPerFood("lunch");
    calculateTotalPerFood("snack");
    calculateTotalPerFood("dinner");
  }
  const transformToShoppingList = (data) => {
    return Object.entries(data).map(([foodId, weightConsumed]) => ({
      foodId: foodId, // Convertir el ID de alimento a ObjectId
      weightConsumed,
      quantityToBuy: 0, // Valor por defecto
    }));
  };
  const weeklyTotal = transformToShoppingList(dailyTotalPerFood);
  await shoppingListModel.deleteMany({ user: result.userId });
  const shoppingList = new shoppingListModel({
    user: result.userId,
    weeklyTotal: weeklyTotal,
  });
  await shoppingList.save();
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
