const request = require("supertest");
const app = require("../app");
const {
  recipeModel,
  usersModel,
  foodModel,
  categoryModel,
} = require("../models");
const mongoose = require("mongoose");
const sinon = require("sinon");
const jwt = require("jsonwebtoken");
beforeAll(async () => {
  await recipeModel.deleteMany({});
  await foodModel.deleteMany({});
  await usersModel.deleteMany({});
  await categoryModel.deleteMany({});
});
async function login(email) {
  const response = await request(app).post("/api/auth/register").send({
    // se registra
    firstName: "test",
    lastName: "user",
    email: email,
    password: "adminuser",
    sex: "male",
    age: "23",
    height: "1.80",
    weight: "70",
  });
  const response1 = await request(app).post("/api/auth/login").send({
    // se logea para obtener token
    email: email,
    password: "adminuser",
  });
  return response1._body.token;
}

async function createCategory(name, testToken) {
  const response = await request(app)
    .post("/api/category")
    .send({
      name: name,
    })
    .set("Authorization", "Bearer " + testToken);
  return response._body.data._id;
}

async function createFoods(token) {
  const category = await createCategory("Carne", token);
  const foodToSend1 = {
    name: "Lomo",
    calories: 2,
    weight: 10,
    category: category,
    carbs: 0,
    proteins: 0,
    fats: 0,
  };
  const foodToSend2 = {
    name: "Vacio",
    calories: 2,
    weight: 10,
    category: category,
    carbs: 10,
    proteins: 10,
    fats: 10,
  };
  const response = await request(app)
    .post("/api/foods")
    .send(foodToSend1)
    .set("Authorization", "Bearer " + token);
  const response1 = await request(app)
    .post("/api/foods")
    .send(foodToSend2)
    .set("Authorization", "Bearer " + token);
  //console.log(response1._body);
  let foods = [
    { foodId: response._body.data._id, weightConsumed: 100 },
    { foodId: response1._body.data._id, weightConsumed: 200 },
  ];
  return foods;
}

test("A recipe cannot be created without a name and throws and error", async () => {
  const testToken = await login("adminuser@admin.com");
  const foods = await createFoods(testToken);
  const response = await request(app)
    .post("/api/recipes")
    .send({
      name: "",
      foods: foods,
      steps: [{ text: "Paso 1" }],
    })
    .set("Authorization", "Bearer " + testToken);
  expect(response.status).toBe(500);
  expect(response.body).toHaveProperty("status", 500);
  expect(response.body).toHaveProperty("message", "ERROR_CREATE_RECIPE");
});

test("A recipe is successfully created and store in the DB", async () => {
  const testToken = await login("adminuser@admin.com");
  const foods = await createFoods(testToken);
  const response2 = await request(app)
    .post("/api/recipes")
    .send({
      name: "Nueva Receta",
      foods: foods,
      steps: [{ text: "Paso 1" }],
    })
    .set("Authorization", "Bearer " + testToken);
  expect(response2.status).toBe(200);
  expect(response2.body).toHaveProperty("data");
  const recipe = await recipeModel.findById(response2.body.data._id);
  expect(recipe).not.toBeNull();
  expect(recipe.name).toEqual("Nueva Receta");
});

test("A recipe is not created when the image format is wrong", async () => {
  const testToken = await login("adminuser@admin.com");
  const foods = await createFoods(testToken);
  const response = await request(app)
    .post("/api/recipes")
    .send({
      name: "Nueva Receta",
      foods: foods,
      steps: [{ text: "Paso 1", images: ["ssds"] }],
    })
    .set("Authorization", "Bearer " + testToken);

  expect(response.status).toBe(500);
  expect(response.body).toHaveProperty("message", "ERROR_CREATE_RECIPE");
});
test("A recipe is not created when there is no text in the steps", async () => {
  const testToken = await login("adminuser@admin.com");
  const foods = await createFoods(testToken);
  const response = await request(app)
    .post("/api/recipes")
    .send({
      name: "Nueva Receta",
      foods: foods,
      steps: [{ text: "" }],
    })
    .set("Authorization", "Bearer " + testToken);

  expect(response.status).toBe(500);
  expect(response.body).toHaveProperty("message", "ERROR_CREATE_RECIPE");
});

test("A recipe with multiple foods is created and it has all the ingredients added correctly", async () => {
  const testToken = await login("adminuser@admin.com");
  const foods = await createFoods(testToken);
  const response = await request(app)
    .post("/api/recipes")
    .send({
      name: "New Recipe",
      foods: foods,
      steps: [{ text: "Step 1" }],
    })
    .set("Authorization", "Bearer " + testToken);

  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty("data");
  const recipe = await recipeModel.findById(response.body.data._id);
  expect(recipe).not.toBeNull();
  expect(recipe.foods.length).toEqual(2);
});

test("A recipe is created with name 'New Recipe' and it's correctly updated after sending a PUT request with 'Updated Recipe' ", async () => {
  const testToken = await login("adminuser@admin.com");
  const foods = await createFoods(testToken);
  const response = await request(app)
    .post("/api/recipes")
    .send({
      name: "New Recipe",
      foods: foods,
      steps: [{ text: "Step 1" }],
    })
    .set("Authorization", "Bearer " + testToken);
  const responseParsed = JSON.parse(response.text);
  const mealId = responseParsed.data._id;

  const response1 = await request(app)
    .put("/api/recipes/" + mealId)
    .send({
      name: "Updated Recipe",
    })
    .set("Authorization", "Bearer " + testToken);
  //SACAR EL CREATOR DE LA RESPUESTA
  expect(response1.statusCode).toEqual(200);
  const responseParsed1 = JSON.parse(response1.text);
  expect(responseParsed1.data.name).toEqual("Updated Recipe");
});

test("An user that it's not the creator cannot update the recipe", async () => {
  const testToken = await login("adminuser@admin.com");
  const testToken2 = await login("adminuser2@admin.com");
  const foods = await createFoods(testToken);
  const response = await request(app)
    .post("/api/recipes")
    .send({
      name: "New Recipe",
      foods: foods,
      steps: [{ text: "Step 1" }],
    })
    .set("Authorization", "Bearer " + testToken);
  const responseParsed = JSON.parse(response.text);
  const mealId = responseParsed.data._id;

  const response1 = await request(app)
    .put("/api/recipes/" + mealId)
    .send({
      name: "Updated Recipe",
    })
    .set("Authorization", "Bearer " + testToken2);
  //SACAR EL CREATOR DE LA RESPUESTA
  expect(response1.statusCode).toEqual(403);
  expect(response1.body).toHaveProperty("message", "UNAUTHORIZED");
});

test("A new recipe is created and its retrieved correctly when making a GET request", async () => {
  const testToken = await login("adminuser@admin.com");
  const foods = await createFoods(testToken);
  const response = await request(app)
    .post("/api/recipes")
    .send({
      name: "New Recipe",
      foods: foods,
      steps: [{ text: "Step 1" }],
    })
    .set("Authorization", "Bearer " + testToken);

  const recipeGot = await recipeModel.findById(response.body.data._id);
  expect(recipeGot).not.toBeNull();
  expect(recipeGot.name).toEqual("New Recipe");
  expect(recipeGot.steps.length).toEqual(1);
  expect(recipeGot.steps[0].text).toEqual("Step 1");

  const response1 = await request(app)
    .get("/api/recipes")
    .set("Authorization", "Bearer " + testToken);

  expect(response1.statusCode).toEqual(200);

  const responseParsed = JSON.parse(response1.text);
  expect(responseParsed.data.length).toBeGreaterThanOrEqual(1);
  const newRecipe = responseParsed.data.find(
    (recipe) => recipe._id === response.body.data._id
  );
  expect(newRecipe).not.toBeUndefined();
  expect(newRecipe.name).toEqual("New Recipe");
  expect(newRecipe.steps.length).toEqual(1);
  expect(newRecipe.steps[0].text).toEqual("Step 1");
});

test("[PUT RATE] A recipe is rated with 3 after its created", async () => {
  const testToken = await login("adminuser@admin.com");
  const foods = await createFoods(testToken);
  const response1 = await request(app)
    .post("/api/recipes")
    .send({
      name: "New Recipe",
      foods: foods,
      steps: [{ text: "Step 1" }],
    })
    .set("Authorization", "Bearer " + testToken);
  const responseParsed = JSON.parse(response1.text);
  const mealId = responseParsed.data._id;
  const req = {
    rate: 3,
    id: mealId,
  };
  const response2 = await request(app)
    .put("/api/recipes/rate/" + mealId)
    .send(req)
    .set("Authorization", "Bearer " + testToken);
  expect(response2.statusCode).toEqual(200);
  const responseParsed2 = JSON.parse(response2.text);
  expect(responseParsed2.data.ratings.length).toEqual(1);
  expect(responseParsed2.data.ratings[0].rate).toEqual(3);
});

test("[PUT RATE] A recipe cannot be rated with less than 1 and sends an error", async () => {
  const testToken = await login("adminuser@admin.com");
  const foods = await createFoods(testToken);
  const response1 = await request(app)
    .post("/api/recipes")
    .send({
      name: "New Recipe",
      foods: foods,
      steps: [{ text: "Step 1" }],
    })
    .set("Authorization", "Bearer " + testToken);
  const responseParsed = JSON.parse(response1.text);
  const mealId = responseParsed.data._id;
  const req = {
    rate: 0,
    id: mealId,
  };
  const response2 = await request(app)
    .put("/api/recipes/rate/" + mealId)
    .send(req)
    .set("Authorization", "Bearer " + testToken);
  expect(response2.statusCode).toEqual(500);
  expect(response2.body).toHaveProperty("message", "ERROR_ADD_RATE");
});

test("[PUT RATE] A recipe cannot be rated with more than 5 and sends an error", async () => {
  const testToken = await login("adminuser@admin.com");
  const foods = await createFoods(testToken);
  const response1 = await request(app)
    .post("/api/recipes")
    .send({
      name: "New Recipe",
      foods: foods,
      steps: [{ text: "Step 1" }],
    })
    .set("Authorization", "Bearer " + testToken);
  const responseParsed = JSON.parse(response1.text);
  const mealId = responseParsed.data._id;
  const req = {
    rate: 6,
    id: mealId,
  };
  const response2 = await request(app)
    .put("/api/recipes/rate/" + mealId)
    .send(req)
    .set("Authorization", "Bearer " + testToken);
  expect(response2.statusCode).toEqual(500);
  expect(response2.body).toHaveProperty("message", "ERROR_ADD_RATE");
});
