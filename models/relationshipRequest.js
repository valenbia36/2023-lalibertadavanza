const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");
const { Schema } = mongoose;

const relationshipRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    nutritionist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    status: {
      type: String,
      enum: ["Sent", "Accepted", "Rejected"],
      default: "sent",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

relationshipRequestSchema.plugin(mongooseDelete, { overrideMethods: "all" });
module.exports = mongoose.model("relationshipRequest", relationshipRequestSchema);
