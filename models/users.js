const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");
const { Schema } = mongoose;

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      maxLength: 25,
    },
    lastName: {
      type: String,
      required: true,
      maxLength: 25,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      maxLength: 50,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    sex: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
      min: [0],
      max: 99,
    },
    height: {
      type: Number,
      required: true,
      min: [0],
      max: 999,
    },
    weight: {
      type: Number,
      required: true,
      min: [0],
      max: 999,
    },
    secretToken: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userSchema.plugin(mongooseDelete, { overrideMethods: "all" });
module.exports = mongoose.model("users", userSchema);
