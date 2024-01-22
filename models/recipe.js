const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");
const { Schema } = mongoose;

const recipeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    ingredients: {
      type: [],
    },
    steps: [
      {
        description: { type: String },
      },
    ],
    images: [
      {
        data: Buffer, // Datos binarios de la imagen
        contentType: String, // Tipo de contenido de la imagen (ej. 'image/jpeg')
      },
    ],
    ranking: {
      type: Number,
      default: 0,
    },
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
