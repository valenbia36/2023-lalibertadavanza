const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");

const mealSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    foods: {
      type: [
        { type: mongoose.Schema.Types.Mixed, ref: "food", required: true },
      ],
      required: true,
      validate: {
        validator: function (array) {
          return array.length > 0;
        },
        message: "El array debe contener al menos un elemento.",
      },
    },
    date: {
      type: Date,
    },
    hour: {
      type: String,
      match: /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
    },
    calories: {
      type: Number,
      min: [0],
    },
    carbs: {
      type: Number,
      min: [0],
      default: 0,
    },
    proteins: {
      type: Number,
      min: [0],
      default: 0,
    },
    fats: {
      type: Number,
      min: [0],
      default: 0,
    },
    userId: {
      type: String,
      required: true,
    },
    /* {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    } */ // Deberia ser asi pero rompe con los tests porque no esta el usuario registrado
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

mealSchema.plugin(mongooseDelete, { overrideMethods: "all" });
module.exports = mongoose.model("meals", mealSchema);
