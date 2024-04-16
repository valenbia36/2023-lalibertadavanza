const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");
const { Schema } = mongoose;

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
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
    },
    height: {
      type: Number,
      required: true,
      min: [0],
    },
    weight: {
      type: Number,
      required: true,
      min: [0],
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
