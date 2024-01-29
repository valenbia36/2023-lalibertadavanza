const express = require("express");
const { weekModel } = require("../models");

const getWeek = async (req, res) => {
  try {
    const userId = req.params.id; // Supongo que el userId está en los parámetros de la solicitud
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

    // Supongamos que tienes un identificador único para el plan (por ejemplo, userId)
    const userId = req.body.userId; // Asegúrate de obtener el ID del usuario de tu sistema de autenticación

    // Busca el plan existente en función del userId y actualiza los campos
    const result = await weekModel.findOneAndUpdate(
      { userId: userId },
      updatedPlan,
      {
        new: true,
        upsert: true, // Si no existe, crea un nuevo documento
        setDefaultsOnInsert: true, // Aplica valores predeterminados si se crea un nuevo documento
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
