const request = require("supertest");
const app = require("../app");
const {
  recipeModel,
  usersModel,
  foodModel,
  categoryModel,
  shoppingListModel,
  weekModel,
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

test("Creating a shopping list when saving a week", async () => {
  const testToken = await login("adminuser1@admin.com");
  const foods = await createFoods(testToken);

  const recipeToSend = {
    name: "Test Recipe",
    foods: foods,
    steps: [{ text: "Step 1" }],
  };

  const response = await request(app)
    .post("/api/recipes")
    .send(recipeToSend)
    .set("Authorization", "Bearer " + testToken);

  const weekToSend = {
    Friday: {
      breakfast: new mongoose.Types.ObjectId(response._body.data._id),
      lunch: null,
      snack: null,
      dinner: null,
    },
    Monday: {
      breakfast: null,
      lunch: null,
      snack: null,
      dinner: null,
    },
    Saturday: {
      breakfast: null,
      lunch: null,
      snack: null,
      dinner: null,
    },
    Sunday: {
      breakfast: null,
      lunch: null,
      snack: null,
      dinner: null,
    },
    Thursday: {
      breakfast: null,
      lunch: null,
      snack: null,
      dinner: null,
    },
    Tuesday: {
      breakfast: null,
      lunch: null,
      snack: null,
      dinner: null,
    },
    Wednesday: {
      breakfast: null,
      lunch: null,
      snack: null,
      dinner: null,
    },
  };

  const saveWeekResponse = await request(app)
    .put("/api/weeks")
    .send(weekToSend)
    .set("Authorization", "Bearer " + testToken);
  expect(saveWeekResponse.status).toBe(200);

  const shoppingListResponse = await request(app)
    .get("/api/shoppingList")
    .set("Authorization", "Bearer " + testToken);
  expect(shoppingListResponse.status).toBe(200);
  expect(shoppingListResponse.body.shoppingList.weeklyTotal.length).toEqual(2);
  const lomoItem = shoppingListResponse.body.shoppingList.weeklyTotal.find(
    (item) => item.foodId.name === "Lomo"
  );
  const vacioItem = shoppingListResponse.body.shoppingList.weeklyTotal.find(
    (item) => item.foodId.name === "Vacio"
  );
  expect(lomoItem).toBeDefined();
  expect(lomoItem.weightConsumed).toBe(100);

  expect(vacioItem).toBeDefined();
  expect(vacioItem.weightConsumed).toBe(200);
});

test("Updating a shopping list with the amount of a food that was purchased", async () => {
  const testToken = await login("adminuser1@admin.com");
  const foods = await createFoods(testToken);

  const recipeToSend = {
    name: "Test Recipe",
    foods: foods,
    steps: [{ text: "Step 1" }],
  };

  const response = await request(app)
    .post("/api/recipes")
    .send(recipeToSend)
    .set("Authorization", "Bearer " + testToken);

  const weekToSend = {
    Friday: {
      breakfast: new mongoose.Types.ObjectId(response._body.data._id),
      lunch: null,
      snack: null,
      dinner: null,
    },
    Monday: {
      breakfast: null,
      lunch: null,
      snack: null,
      dinner: null,
    },
    Saturday: {
      breakfast: null,
      lunch: null,
      snack: null,
      dinner: null,
    },
    Sunday: {
      breakfast: null,
      lunch: null,
      snack: null,
      dinner: null,
    },
    Thursday: {
      breakfast: null,
      lunch: null,
      snack: null,
      dinner: null,
    },
    Tuesday: {
      breakfast: null,
      lunch: null,
      snack: null,
      dinner: null,
    },
    Wednesday: {
      breakfast: null,
      lunch: null,
      snack: null,
      dinner: null,
    },
  };

  const saveWeekResponse = await request(app)
    .put("/api/weeks")
    .send(weekToSend)
    .set("Authorization", "Bearer " + testToken);
  expect(saveWeekResponse.status).toBe(200);

  const initialShoppingListResponse = await request(app)
    .get("/api/shoppingList")
    .set("Authorization", "Bearer " + testToken);
  expect(initialShoppingListResponse.status).toBe(200);
  const initialShoppingList =
    initialShoppingListResponse.body.shoppingList.weeklyTotal;
  const initialLomoItem = initialShoppingList.find(
    (item) => item.foodId.name === "Lomo"
  );
  expect(initialLomoItem.quantityToBuy).toBe(0);
  const foodToUpdate = foods[0];
  const updatePayload = {
    foodId: {
      foodId: { _id: new mongoose.Types.ObjectId(foodToUpdate.foodId) },
      weightConsumed: foodToUpdate.weightConsumed,
    },
    quantityToBuy: 50,
  };
  const updateResponse = await request(app)
    .put("/api/shoppingList")
    .send(updatePayload)
    .set("Authorization", "Bearer " + testToken);
  expect(updateResponse.status).toBe(200);

  // Obtener la lista de compras después de la actualización
  const updatedShoppingListResponse = await request(app)
    .get("/api/shoppingList")
    .set("Authorization", "Bearer " + testToken);
  expect(updatedShoppingListResponse.status).toBe(200);

  const updatedShoppingList =
    updatedShoppingListResponse.body.shoppingList.weeklyTotal;
  const updatedLomoItem = updatedShoppingList.find(
    (item) => item.foodId.name === "Lomo"
  );
  expect(updatedLomoItem.quantityToBuy).toBe(50);
});
