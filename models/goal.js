const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");

const goalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 17,
    },
    calories: {
      type: Number,
      min: [0],
      required: true,
      max: 999999,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return this.startDate <= value;
        },
        message: (props) =>
          `La fecha de fin debe ser mayor o igual a la fecha de inicio.`,
      },
    },
    recurrency: {
      type: String,
      enum: ["Monthly", "Weekly", "Non-Recurring"],
      validate: {
        validator: function (option) {
          return ["Monthly", "Weekly", "Non-Recurring"].includes(option);
        },
        message: "Invalid option for recurrency",
      },
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

goalSchema.plugin(mongooseDelete, { overrideMethods: "all" });
module.exports = mongoose.model("goal", goalSchema);
