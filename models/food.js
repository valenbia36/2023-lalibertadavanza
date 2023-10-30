const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    calories: {
      type: String,
    },
    weight: {
      type: String,
    },
    category: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

foodSchema.plugin(mongooseDelete, { overrideMethods: "all" });
module.exports = mongoose.model("foods", foodSchema);
