const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");

const weekSchema = new mongoose.Schema({
  startDate: { type: Date, required: true },
  createdDate: { type: Date, default: Date.now },
  Monday: {
    breakfast: { type: String, default: null },
    lunch: { type: String, default: null },
    snack: { type: String, default: null },
    dinner: { type: String, default: null },
  },
  Tuesday: {
    breakfast: { type: String, default: null },
    lunch: { type: String, default: null },
    snack: { type: String, default: null },
    dinner: { type: String, default: null },
  },
  Wednesday: {
    breakfast: { type: String, default: null },
    lunch: { type: String, default: null },
    snack: { type: String, default: null },
    dinner: { type: String, default: null },
  },
  Thursday: {
    breakfast: { type: String, default: null },
    lunch: { type: String, default: null },
    snack: { type: String, default: null },
    dinner: { type: String, default: null },
  },
  Friday: {
    breakfast: { type: String, default: null },
    lunch: { type: String, default: null },
    snack: { type: String, default: null },
    dinner: { type: String, default: null },
  },
  Saturday: {
    breakfast: { type: String, default: null },
    lunch: { type: String, default: null },
    snack: { type: String, default: null },
    dinner: { type: String, default: null },
  },
  Sunday: {
    breakfast: { type: String, default: null },
    lunch: { type: String, default: null },
    snack: { type: String, default: null },
    dinner: { type: String, default: null },
  },
});

weekSchema.plugin(mongooseDelete, { overrideMethods: "all" });
module.exports = mongoose.model("week", weekSchema);
