const mongoose = require("mongoose");

const shoppingListSchema = new mongoose.Schema({
  weeklyTotal: [
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
});

module.exports = mongoose.model("ShoppingList", shoppingListSchema);
