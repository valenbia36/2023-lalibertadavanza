const express = require("express");
const { weekModel } = require("../models");

// Ruta para obtener la semana actual
const getCurrentWeek = async (req, res) => {
  try {
    const today = new Date();
    const lastSunday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - today.getDay()
    );
    const nextSaturday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + (6 - today.getDay()) + 1
    );

    const currentWeek = await weekModel.findOne({
      startDate: { $gte: lastSunday, $lt: nextSaturday },
    });

    if (!currentWeek) {
      return res
        .status(404)
        .json({ message: "No data found for the current week" });
    }

    res.status(200).json(currentWeek);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getWeeks = async (req, res) => {
  try {
    const weeks = await weekModel.find();
    res.status(200).json(weeks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const saveWeek = async (req, res) => {
  try {
    const { startDate, selectedRecipes } = req.body;
    console.log(startDate + selectedRecipes);

    // Buscar si ya existe una semana con la misma fecha de inicio
    const existingWeek = await weekModel.findOne({ startDate });

    if (existingWeek) {
      // Si existe, actualizar la semana existente
      await existingWeek.updateOne({ ...selectedRecipes });
      res.status(200).json({ message: "Week updated successfully" });
    } else {
      // Si no existe, crear una nueva semana
      const week = new weekModel({ startDate, ...selectedRecipes });
      await week.save();
      res.status(201).json({ message: "Week saved successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getCurrentWeek,
  getWeeks,
  saveWeek,
};
