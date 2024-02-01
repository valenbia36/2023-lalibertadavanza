const mongooseDelete = require("mongoose-delete");
const mongoose = require("mongoose");

/* const mealSchema = new mongoose.Schema({
  breakfast: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "recipe",
  },
  lunch: { type: mongoose.Schema.Types.Mixed, ref: "recipe" },
  snack: { type: mongoose.Schema.Types.Mixed, ref: "recipe" },
  dinner: { type: mongoose.Schema.Types.Mixed, ref: "recipe" },
}); */
const mealSchema = new mongoose.Schema({
  breakfast: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "recipe",
  },
  lunch: { type: mongoose.Schema.Types.ObjectId, ref: "recipe" },
  snack: { type: mongoose.Schema.Types.ObjectId, ref: "recipe" },
  dinner: { type: mongoose.Schema.Types.ObjectId, ref: "recipe" },
});

const weekSchema = new mongoose.Schema(
  {
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
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

weekSchema.plugin(mongooseDelete, { overrideMethods: "all" });
module.exports = mongoose.model("week", weekSchema);
