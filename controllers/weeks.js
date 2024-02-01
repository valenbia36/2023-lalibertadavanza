const express = require("express");
const { weekModel } = require("../models");

const getWeek = async (req, res) => {
  try {
    const userId = req.params.id;
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
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const saveWeek = async (req, res) => {
  try {
    const updatedPlan = req.body;

    if (!updatedPlan.userId) {
      return res
        .status(400)
        .json({ success: false, error: "El userId es obligatorio." });
    }

    const result = await weekModel.findOneAndUpdate(
      { userId: updatedPlan.userId },
      updatedPlan,
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Error al actualizar el plan." });
  }
};

module.exports = {
  getWeek,
  saveWeek,
};
