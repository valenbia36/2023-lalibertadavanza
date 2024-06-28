const mongoose = require("mongoose");

const shoppingListSchema = new mongoose.Schema({
  day: {
    type: String,
    enum: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    required: true,
  },
  meals: {
    breakfast: [
      {
        foodId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "food", // Reemplaza "food" con el nombre de tu modelo de alimentos si es diferente
          required: true,
        },
        weightConsumed: {
          type: Number,
          required: true,
        },
      },
    ],
    lunch: [
      {
        foodId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "food",
          required: true,
        },
        weightConsumed: {
          type: Number,
          required: true,
        },
      },
    ],
    snack: [
      {
        foodId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "food",
          required: true,
        },
        weightConsumed: {
          type: Number,
          required: true,
        },
      },
    ],
    dinner: [
      {
        foodId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "food",
          required: true,
        },
        weightConsumed: {
          type: Number,
          required: true,
        },
      },
    ],
  },
});

module.exports = mongoose.model("ShoppingList", shoppingListSchema);
