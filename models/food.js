const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    calories: {
      type: String,
      required: true,
    },
    carbs: {
      type: String,
    },
    proteins: {
      type: String,
    },
    fats: {
      type: String,
    },
    weight: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

foodSchema.plugin(mongooseDelete, { overrideMethods: "all" });
module.exports = mongoose.model("foods", foodSchema);
