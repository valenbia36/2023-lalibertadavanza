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
      validate: {
        validator: function (value) {
          // Validar si la cadena es una imagen en base64
          const base64Regex = /^data:image\/([a-zA-Z]*);base64,([^\"]*)$/;
          return base64Regex.test(value);
        },
        message: (props) =>
          `${props.value} no es una imagen en formato base64 válida!`,
      },
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
    steps: {
      type: [stepSchema],
      validate: {
        validator: function (v) {
          return v && v.length > 0;
        },
        message: 'Debe haber al menos un elemento en el array "steps".',
      },
    },
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
