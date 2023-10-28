const { intermittentFastingModel } = require("../models");
const { handleHttpError } = require("../utils/handleErrors");

const createIntermittentFasting = async (req, res) => {
  try {
    const data = await intermittentFastingModel.create(req.body);
    res.send({ data });
  } catch (e) {
    handleHttpError(res, "ERROR_CREATE_INTERMITTENT_FASTING", 500);
  }
};

const getIntermittentFastingByUserId = async (req, res) => {
  try {
    const data = await intermittentFastingModel.find({
      userId: req.params.userId,
    });
    res.send({ data });
  } catch (e) {
    handleHttpError(res, "ERROR_GET_INTERMITTENT_FASTING_BY_USER_ID", 500);
  }
};

const getActiveIntermittentFastingByUserId = async (req, res) => {
  try {
    const currentDate = new Date();

    const data = await intermittentFastingModel.find({
      startDateTime: { $gte: currentDate },
      endDateTime: { $lte: currentDate },
      userId: req.params.userId,
    });
    res.send({ data });
  } catch (e) {
    handleHttpError(res, "ERROR_GET_INTERMITTENT_FASTING_BY_USER_ID", 500);
  }
};

module.exports = {
  createIntermittentFasting,
  getIntermittentFastingByUserId,
  getActiveIntermittentFastingByUserId,
};
