const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");
const { Schema } = mongoose;

const stepSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  images: [
    {
      type: String,
    },
  ],
});
const ratingSchema = new mongoose.Schema({
  rate: {
    type: Number,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
});
const recipeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    ingredients: {
      type: [],
    },
    steps: [stepSchema],
    ratings: [ratingSchema],
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
  },
  {
    timestamps: true, // Agrega campos de createdAt y updatedAt automáticamente
    versionKey: false,
  }
);

recipeSchema.plugin(mongooseDelete, { overrideMethods: "all" });
module.exports = mongoose.model("recipe", recipeSchema);
