const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");

const mealSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    foods: {
      type: [],
    },
    date: {
      type: String,
    },
    hour: {
      type: String,
    },
    calories: {
      type: Number,
    },
    carbs: {
      type: String,
      default: 0,
    },
    proteins: {
      type: String,
      default: 0,
    },
    fats: {
      type: String,
      default: 0,
    },
    userId: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

mealSchema.plugin(mongooseDelete, { overrideMethods: "all" });
module.exports = mongoose.model("meals", mealSchema);
