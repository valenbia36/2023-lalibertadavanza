const { intermittentFastingModel, usersModel } = require("../models");
const { handleHttpError } = require("../utils/handleErrors");
const schedule = require("node-schedule");
const { sendIntermittentFastingNotificationEmail } = require("./notifications");

const createIntermittentFasting = async (req, res) => {
  try {
    const userId = req.userId;
    const userData = await usersModel.findById(userId);
    const email = userData.email;
    const userName = userData.firstName;
    const overlappingFasting = await intermittentFastingModel.findOne({
      $or: [
        {
          startDateTime: { $lt: req.body.endDateTime },
          endDateTime: { $gt: req.body.startDateTime },
        },
      ],
      userId: userId,
    });

    if (overlappingFasting) {
      return handleHttpError(res, "CONFLICTING_FASTING_PERIOD", 501);
    }
    const itFastingData = { ...req.body, userId };
    const data = await intermittentFastingModel.create(itFastingData);
    const endDateTime = new Date(req.body.endDateTime);
    schedule.scheduleJob(
      endDateTime.setTime(endDateTime.getTime() + 2 * 3600000),
      () => {
        const reqUpdateUser = {
          body: {
            email: email,
            userName: userName,
          },
        };

        const resUpdateUser = {
          send: (data) => {},
          status: (statusCode) => {
            console.log(`Status Code: ${statusCode}`);
          },
        };
        sendIntermittentFastingNotificationEmail(reqUpdateUser, resUpdateUser);
      }
    );
    res.send({ data });
  } catch (e) {
    handleHttpError(res, "ERROR_CREATE_INTERMITTENT_FASTING", 500);
  }
};

const getActiveIntermittentFastingByUserId = async (req, res) => {
  try {
    const data = await intermittentFastingModel.find({
      userId: req.userId,
    });
    const today = new Date();
    today.setSeconds(0);
    today.setHours(today.getHours() - 3);
    const filteredData = data.find(
      (item) => today >= item.startDateTime && today <= item.endDateTime
    );
    res.send({ filteredData });
  } catch (e) {
    handleHttpError(
      res,
      "ERROR_GET_ACTIVE_INTERMITTENT_FASTING_BY_USER_ID",
      500
    );
  }
};

const getNextIntermittentFastingByUserId = async (req, res) => {
  try {
    const today = new Date();
    today.setSeconds(0);
    today.setHours(today.getHours() - 3);
    const filteredData = await intermittentFastingModel
      .find({
        userId: req.userId,
        startDateTime: { $gt: today }, // Filtrar por startDateTime mayor que la fecha actual
      })
      .sort({ startDateTime: 1 }) // Ordenar por startDateTime ascendente
      .limit(1); // Limitar el resultado a 1 documento

    res.send({ filteredData });
  } catch (e) {
    handleHttpError(
      res,
      "ERROR_GET_ACTIVE_INTERMITTENT_FASTING_BY_USER_ID",
      500
    );
  }
};

const deleteActiveIntermittentFasting = async (req, res) => {
  try {
    userId = req.userId;
    const intFastToDelete = await intermittentFastingModel.findById({
      _id: req.params.IntermittentFastingId,
    });
    if (!intFastToDelete || intFastToDelete.userId.toString() !== userId) {
      return res.status(403).json({
        message: "You don't have permission to cancel this intermitent fasting",
      });
    }
    const data = await intermittentFastingModel.delete({
      _id: req.params.IntermittentFastingId,
    });
    res.send({ data });
  } catch (e) {
    handleHttpError(res, "ERROR_DELETE_GOAL", 500);
  }
};

module.exports = {
  createIntermittentFasting,
  getActiveIntermittentFastingByUserId,
  deleteActiveIntermittentFasting,
  getNextIntermittentFastingByUserId,
};
