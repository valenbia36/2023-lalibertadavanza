const request = require("supertest");
const app = require("../app");
const { createRecipe, updateRecipeById } = require("../controllers/recipes");
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
      foods: [
        {
          name: "Lomo",
          calories: 500,
          weight: 500,
          category: "Carnes Rojas",
          carbs: 100,
          proteins: 300,
          fats: 0,
          weightConsumed: 11,
          totalCalories: 11,
          totalCarbs: 2,
          totalProteins: 7,
          totalFats: 0,
        },
      ],
      steps: [{ text: "Paso 1" }],
      userId: "65aeb07036d8ac71f781636b",
    });

  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty("data");
  // Asegúrate de que se haya creado correctamente en la base de datos
  const recipe = await recipeModel.findById(response.body.data._id);
  expect(recipe).not.toBeNull();
});
test("No se creo la receta correctamente por formato de imagen incorrecta", async () => {
  const response = await request(app)
    .post("/api/recipes")
    .send({
      name: "Nueva Receta",
      foods: [
        {
          name: "Lomo",
          calories: 500,
          weight: 500,
          category: "Carnes Rojas",
          carbs: 100,
          proteins: 300,
          fats: 0,
          weightConsumed: 11,
          totalCalories: 11,
          totalCarbs: 2,
          totalProteins: 7,
          totalFats: 0,
        },
      ],
      steps: [{ text: "Paso 1", images: ["Asas"] }],
      userId: "65aeb07036d8ac71f781636b",
    });

  expect(response.status).toBe(500);
});

test("Se creo la receta correctamente con multiples alimentos", async () => {
  const response = await request(app)
    .post("/api/recipes")
    .send({
      name: "Nueva Receta",
      foods: [
        {
          name: "Lomo",
          calories: 500,
          weight: 500,
          category: "Carnes Rojas",
          carbs: 100,
          proteins: 300,
          fats: 0,
          weightConsumed: 11,
          totalCalories: 11,
          totalCarbs: 2,
          totalProteins: 7,
          totalFats: 0,
        },
        {
          name: "Pollo",
          calories: 200,
          weight: 300,
          category: "Carnes Blancas",
          carbs: 100,
          proteins: 300,
          fats: 0,
          weightConsumed: 11,
          totalCalories: 11,
          totalCarbs: 2,
          totalProteins: 7,
          totalFats: 0,
        },
      ],
      steps: [{ text: "Paso 1" }],
      userId: "65aeb07036d8ac71f781636b",
    });

  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty("data");
  // Asegúrate de que se haya creado correctamente en la base de datos
  const recipe = await recipeModel.findById(response.body.data._id);
  expect(recipe).not.toBeNull();
});

test("[UPDATE RECIPE] Esto deberia retornar un 200", async () => {
  const response = await request(app)
    .post("/api/recipes")
    .send({
      name: "Nueva Receta",
      foods: [
        {
          name: "Lomo",
          calories: 500,
          weight: 500,
          category: "Carnes Rojas",
          carbs: 100,
          proteins: 300,
          fats: 0,
          weightConsumed: 11,
          totalCalories: 11,
          totalCarbs: 2,
          totalProteins: 7,
          totalFats: 0,
        },
      ],
      steps: [{ text: "Paso 1" }],
      userId: "65aeb07036d8ac71f781636b",
    });
  const responseParsed = JSON.parse(response.text);
  const mealId = responseParsed.data._id;

  const response1 = await request(app)
    .put("/api/recipes/" + mealId)
    .send({
      name: "Receta Modificada",
    });
  expect(response1.statusCode).toEqual(200);
});

test("[UPDATE RECIPE] Esto deberia retornar un 500", async () => {
  const response = await request(app)
    .post("/api/recipes")
    .send({
      name: "Nueva Receta",
      foods: [
        {
          name: "Lomo",
          calories: 500,
          weight: 500,
          category: "Carnes Rojas",
          carbs: 100,
          proteins: 300,
          fats: 0,
          weightConsumed: 11,
          totalCalories: 11,
          totalCarbs: 2,
          totalProteins: 7,
          totalFats: 0,
        },
      ],
      steps: [{ text: "Paso 1" }],
      userId: "65aeb07036d8ac71f781636b",
    });
  const responseParsed = JSON.parse(response.text);
  const mealId = "2222";

  const response1 = await request(app)
    .put("/api/recipes/" + mealId)
    .send({
      name: "Receta Modificada",
    });
  expect(response1.statusCode).toEqual(500);
});

test("[GET RECIPES] Esto deberia retornar un 200", async () => {
  const recipe = {
    name: "Nueva Receta",
    foods: [
      {
        name: "Lomo",
        calories: 500,
        weight: 500,
        category: "Carnes Rojas",
        carbs: 100,
        proteins: 300,
        fats: 0,
        weightConsumed: 11,
        totalCalories: 11,
        totalCarbs: 2,
        totalProteins: 7,
        totalFats: 0,
      },
    ],
    steps: [{ text: "Paso 1" }],
    userId: "65aeb07036d8ac71f781636b",
  };
  const response = await request(app).post("/api/recipes").send(recipe);
  expect(response.body).toHaveProperty("data");
  // Asegúrate de que se haya creado correctamente en la base de datos
  const recipeGot = await recipeModel.findById(response.body.data._id);

  const response1 = await request(app).get("/api/recipes");
  expect(response1.statusCode).toEqual(200);
});

test("[PUT RATE] Esto deberia retornar un 200", async () => {
  const recipe = {
    name: "Nueva Receta",
    foods: [
      {
        name: "Lomo",
        calories: 500,
        weight: 500,
        category: "Carnes Rojas",
        carbs: 100,
        proteins: 300,
        fats: 0,
        weightConsumed: 11,
        totalCalories: 11,
        totalCarbs: 2,
        totalProteins: 7,
        totalFats: 0,
      },
    ],
    steps: [{ text: "Paso 1" }],
    userId: "65aeb07036d8ac71f781636b",
  };
  const response = await request(app).post("/api/recipes").send(recipe);
  const responseParsed = JSON.parse(response.text);
  const mealId = responseParsed.data._id;
  const req = {
    rate: 3,
    userId: "65aeb174581f0ba5c7f87d9d",
    id: mealId,
  };
  const response1 = await request(app)
    .put("/api/recipes/rate/" + mealId)
    .send(req);
  expect(response1.statusCode).toEqual(200);
});
