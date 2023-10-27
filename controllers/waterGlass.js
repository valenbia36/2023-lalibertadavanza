const { waterGlassModel } = require("../models");
const { handleHttpError } = require("../utils/handleErrors");

const createWaterGlass = async (req, res) => {
  try {
    const data = await waterGlassModel.create(req.body);
    res.send({ data });
  } catch (e) {
    handleHttpError(res, "ERROR_CREATE_WATER_GLASS", 500);
  }
};

const getWaterGlassByUserId = async (req, res) => {
  try {
    const data = await waterGlassModel.find({ userId: req.params.userId });
    res.send({ data });
  } catch (e) {
    handleHttpError(res, "ERROR_GET_WATER_GLASS_BY_USER_ID", 500);
  }
};

const getWaterGlassForUserIdByDay = async (req, res) => {

  const userId = req.params.userId;

  try {
    const result = await waterGlassModel.aggregate([
      {
        $match: { userId },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id": 1 }
      },
    ]);
    res.send({ result });
  } catch (e) {
    console.log(e);
    handleHttpError(res, "ERROR_GET_WATER_GLASS_FOR_USER_ID_COUNT_BY_DATE", 500);
  }
};

module.exports = {
  createWaterGlass,
  getWaterGlassByUserId,
  getWaterGlassForUserIdByDay,
};
