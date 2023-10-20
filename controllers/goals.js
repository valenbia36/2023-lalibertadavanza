const { goalModel,mealModel } = require("../models");
const { handleHttpError } = require("../utils/handleErrors");

const getGoalsByUserId = async (req, res) => {
  try {
    const data = await goalModel.find({ userId: req.params.userId });
    res.send({ data });
  } catch (e) {
    handleHttpError(res, "ERROR_GET_GOALS_BY_USER_ID", 500);
  }
};

const getActiveGoalsByUserId = async (req, res) => {
  try {
    const data = await goalModel.find({ userId: req.params.userId });
    const filteredData = data.filter(
      (item) => new Date().setHours(0,0,0,0) >= item.startDate && new Date().setHours(0,0,0,0) <= item.endDate
    );
    res.send({ filteredData });
  } catch (e) {
    handleHttpError(res, "ERROR_GET_GOALS_BY_USER_ID", 500);
  }
};

const getGoalsByUserWithProgress = async(req,res) => {
  try {
    const goals = await goalModel.find({ userId: req.params.userId });

    const goalsWithProgress = await Promise.all(goals.map(async (item) => {
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
    
      const newItem = {
        ...item.toObject(),
        totalCalorias: totalCalorias,
      };
    
      return newItem;
    }));
    res.send({ goalsWithProgress });
  } catch (e) {
    handleHttpError(res, "ERROR_GET_GOALS_BY_USER_ID", 500);
  }
}

const createGoal = async (req, res) => {
  try {
    const data = await goalModel.create(req.body);
    res.send({ data });
  } catch (e) {
    handleHttpError(res, "ERROR_CREATE_GOAL", 500);
  }
};

const updateGoal = async (req, res) => {
  try {
    const data = await goalModel.findOneAndUpdate(
      { _id: req.params.goalId },
      req.body
    );
    res.send({ data });
  } catch (e) {
    handleHttpError(res, "ERROR_UPDATE_GOAL", 500);
  }
};

const deleteGoal = async (req, res) => {
  try {
    const data = await goalModel.delete({ _id: req.params.goalId });
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
  getGoalsByUserWithProgress
};
