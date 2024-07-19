const { goalModel, mealModel } = require("../models");
const { handleHttpError } = require("../utils/handleErrors");
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

const getGoalsByUserId = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return handleHttpError(res, "User ID not provided", 400);
    }

    const data = await goalModel
      .find({ userId: userId })
      .select("-userId -_id");

    res.send({ data: data });
  } catch (e) {
    handleHttpError(res, "ERROR_GET_GOALS_BY_USER_ID", 500);
  }
};

const getActiveGoalsByUserId = async (req, res) => {
  try {
    const today = new Date();

    today.setHours(-3, 0, 0, 0);
    const userId = req.userId;
    if (!userId) {
      return handleHttpError(res, "User ID not provided", 400);
    }
    const data = await goalModel
      .find({ userId: userId })
      .select("-userId -_id");
    const filteredData = data.filter(
      (item) => today >= item.startDate && today <= item.endDate
    );
    res.send({ filteredData });
  } catch (e) {
    handleHttpError(res, "ERROR_GET_GOALS_BY_USER_ID", 500);
  }
};

const calculateGoalStatus = async (goal) => {
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const goalStartDate = new Date(goal.startDate);
  const goalEndDate = new Date(goal.endDate);
  if (today < goalStartDate) {
    return "Not started";
  } else if (today >= goalStartDate && today <= goalEndDate) {
    return "In progress";
  } else {
    if (goal.recurrency === "Monthly") {
      await goalModel.deleteOne({ _id: goal._id });
      goal.startDate.setMonth(goal.startDate.getMonth() + 1);
      goal.endDate.setMonth(goal.endDate.getMonth() + 1);
      await createNewRecurrencyGoal(goal);
    }
    if (goal.recurrency === "Weekly") {
      await goalModel.deleteOne({ _id: goal._id });
      goal.startDate.setDate(goal.startDate.getDate() + 7);
      goal.endDate.setDate(goal.endDate.getDate() + 7);
      await createNewRecurrencyGoal(goal);
    }
    return "Expired";
  }
};

const createNewRecurrencyGoal = async (goal) => {
  const newGoal = {
    name: goal.name,
    calories: goal.calories,
    userId: goal.userId,
    startDate: goal.startDate,
    endDate: goal.endDate,
    recurrency: goal.recurrency,
  };
  await goalModel.create(newGoal);
};

const getGoalsByUserWithProgress = async (req, res) => {
  try {
    const userId = req.userId;
    const goals = await goalModel.find({ userId: userId });
    const goalsWithProgress = await Promise.all(
      goals.map(async (item) => {
        const userId = item.userId;
        const startDate = item.startDate.toISOString();
        const endDate = item.endDate.toISOString();
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
        let totalCalorias = 0;
        const meals = result.map((meal) => meal.toJSON());
        meals.forEach((meal) => {
          let mealUpdated = calculateNutritionalInformation(meal);
          totalCalorias += mealUpdated.totalCalories;
        });

        const state = await calculateGoalStatus(item);

        const newItem = {
          ...item.toObject(),
          totalCalorias: totalCalorias,
          state: state,
        };
        return newItem;
      })
    );
    //Sacar userId de la res
    res.send({ goalsWithProgress });
  } catch (e) {
    handleHttpError(res, "ERROR_GET_GOALS_BY_USER_ID", 500);
  }
};

const createGoal = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return handleHttpError(res, "User ID not provided", 400);
    }
    const data = await goalModel.create({ ...req.body, userId: userId });
    const { userId: removedUserId, ...responseData } = data.toObject();
    res.send({ data: responseData });
  } catch (e) {
    handleHttpError(res, "ERROR_CREATE_GOAL", 500);
  }
};

const updateGoal = async (req, res) => {
  try {
    const userId = req.userId;
    const goalId = req.params.goalId;
    const info = {
      name: req.body.name,
      calories: req.body.calories,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      recurrency: req.body.recurrency,
    };

    // Primero, verificamos si el objetivo pertenece al usuario actual
    const goal = await goalModel.findOne({ _id: goalId, userId: userId });
    if (!goal) {
      return handleHttpError(res, "Goal not found or unauthorized", 404);
    }
    const status = await calculateGoalStatus(goal);
    if (status == "Expired") {
      return handleHttpError(
        res,
        "Can't edit a goal that has started or it's expired",
        500
      );
    }
    // Si el objetivo pertenece al usuario, procedemos a actualizarlo
    const updatedGoal = await goalModel.findOneAndUpdate(
      { _id: goalId },
      info,
      { new: true }
    );
    res.send({ data: updatedGoal });
  } catch (e) {
    handleHttpError(res, "ERROR_UPDATE_GOAL", 500);
  }
};

const deleteGoal = async (req, res) => {
  try {
    const userId = req.userId;
    const goalId = req.params.goalId;

    // Primero, verificamos si el objetivo pertenece al usuario actual
    const goal = await goalModel.findOne({ _id: goalId, userId: userId });
    if (!goal) {
      return handleHttpError(res, "Goal not found or unauthorized", 404);
    }

    // Si el objetivo pertenece al usuario, procedemos a eliminarlo
    const data = await goalModel.deleteOne({ _id: goalId });
    res.send({ data });
  } catch (e) {
    handleHttpError(res, "ERROR_DELETE_GOAL", 500);
  }
};

module.exports = {
  getGoalsByUserId,
  createGoal,
  updateGoal,
  deleteGoal,
  getActiveGoalsByUserId,
  getGoalsByUserWithProgress,
};
