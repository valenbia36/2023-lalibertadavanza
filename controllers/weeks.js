const express = require("express");
const { weekModel } = require("../models");

const getWeek = async (req, res) => {
  try {
    const userId = req.params.id;
    const weeks = await weekModel.find({ userId: userId });
    res.status(200).json(weeks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const saveWeek = async (req, res) => {
  try {
    const updatedPlan = req.body;
    console.log(req.body);

    const userId = req.body.userId;

    const result = await weekModel.findOneAndUpdate(
      { userId: userId },
      updatedPlan,
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, error: "Error al actualizar el plan." });
  }
};

module.exports = {
  getWeek,
  saveWeek,
};
