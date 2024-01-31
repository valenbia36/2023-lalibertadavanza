const mongooseDelete = require("mongoose-delete");
const mongoose = require("mongoose");

const mealSchema = new mongoose.Schema({
  breakfast: {
    type: mongoose.Schema.Types.Mixed,
    ref: "recipe",
  },
  lunch: {
    type: mongoose.Schema.Types.Mixed,
    ref: "recipe",
    validate: {
      validator: async function (value) {
        // Check if the provided lunch value is a valid recipe
        const Recipe = mongoose.model("recipe");
        if (value) {
          try {
            // Attempt to find the recipe by ID
            const isValidRecipe = await Recipe.findById(value);
            return isValidRecipe !== null;
          } catch (error) {
            // Handle any errors during the validation process
            return false;
          }
        }
        return true; // If lunch is not provided, it is considered valid
      },
      message: "Invalid lunch recipe.",
    },
  },
  snack: { type: mongoose.Schema.Types.Mixed, ref: "recipe" },
  dinner: { type: mongoose.Schema.Types.Mixed, ref: "recipe" },
});
const weekSchema = new mongoose.Schema({
  Monday: mealSchema,
  Tuesday: mealSchema,
  Wednesday: mealSchema,
  Thursday: mealSchema,
  Friday: mealSchema,
  Saturday: mealSchema,
  Sunday: mealSchema,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
});

weekSchema.plugin(mongooseDelete, { overrideMethods: "all" });
module.exports = mongoose.model("week", weekSchema);
