const request = require("supertest");
const app = require("../app");
const { createRecipe } = require("../controllers/recipes");
const { recipeModel } = require("../models");
const mongoose = require("mongoose");
const sinon = require("sinon");

beforeAll(async () => {
  await recipeModel.deleteMany({});
});

test("No se creo la receta correctamente por data incorrecta", async () => {
  const response = await request(app)
    .post("/api/recipes")
    .send({
      name: "",
      foods: ["Ingrediente1", "Ingrediente2"],
      steps: [{ text: "Paso 1" }],
      userId: "",
    });
  expect(response.status).toBe(500);
  expect(response.body).toHaveProperty("status", 500);
  expect(response.body).toHaveProperty("message", "ERROR_CREATE_RECIPE");
});

test("Se creo la receta correctamente", async () => {
  const response = await request(app)
    .post("/api/recipes")
    .send({
      name: "Nueva Receta",
      foods: ["Ingrediente1", "Ingrediente2"],
      steps: [{ text: "Paso 1" }],
      userId: "65aeb07036d8ac71f781636b",
    });

  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty("data");
  // Asegúrate de que se haya creado correctamente en la base de datos
  const recipe = await recipeModel.findById(response.body.data._id);
  expect(recipe).not.toBeNull();
});
