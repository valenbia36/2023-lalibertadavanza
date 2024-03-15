const { ObjectId } = require("mongodb");
const { goalModel, mealModel } = require("../models");
const { handleHttpError } = require("../utils/handleErrors");

const getGoalsByUserId = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return handleHttpError(res, "User ID not provided", 400);
    }

    const data = await goalModel.find({ userId: userId });

    // Eliminar el userId de cada objeto en el array data
    const responseData = data.map((item) => {
      const { userId, ...rest } = item.toObject();
      return rest;
    });

    res.send({ data: responseData });
  } catch (e) {
    handleHttpError(res, "ERROR_GET_GOALS_BY_USER_ID", 500);
  }
};

const getActiveGoalsByUserId = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return handleHttpError(res, "User ID not provided", 400);
    }
    const data = await goalModel.find({ userId: userId });
    const filteredData = data.filter(
      (item) => new Date() >= item.startDate && new Date() <= item.endDate
    );
    res.send({ filteredData });
  } catch (e) {
    handleHttpError(res, "ERROR_GET_GOALS_BY_USER_ID", 500);
  }
};

const calculateGoalStatus = async (goal) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const goalStartDate = new Date(goal.startDate);
  goalStartDate.setHours(0, 0, 0, 0);

  const goalEndDate = new Date(goal.endDate);
  goalEndDate.setHours(0, 0, 0, 0);

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

        const result = await mealModel.find(filter);
        let totalCalorias = 0;
        result.forEach((record) => {
          totalCalorias += record.calories;
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
    res.send({ data });
  } catch (e) {
    handleHttpError(res, "ERROR_CREATE_GOAL", 500);
  }
};

const updateGoal = async (req, res) => {
  try {
    const userId = req.userId;
    const goalId = req.params.goalId;

    // Primero, verificamos si el objetivo pertenece al usuario actual
    const goal = await goalModel.findOne({ _id: goalId, userId: userId });
    if (!goal) {
      return handleHttpError(res, "Goal not found or unauthorized", 404);
    }

    // Si el objetivo pertenece al usuario, procedemos a actualizarlo
    const updatedGoal = await goalModel.findOneAndUpdate(
      { _id: goalId },
      req.body,
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
