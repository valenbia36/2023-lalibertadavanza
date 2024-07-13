const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");

const shoppingListSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user", // Referencia al modelo de usuario
    required: true,
  },
  weeklyTotal: [
    {
      foodId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "foods", // Referencia al modelo de alimentos
        required: true,
      },
      weightConsumed: {
        type: Number,
        required: true,
      },
      quantityToBuy: {
        type: Number,
        default: 0,
      },
    },
  ],
});

shoppingListSchema.plugin(mongooseDelete, { overrideMethods: "all" });
module.exports = mongoose.model("shoppingList", shoppingListSchema);
