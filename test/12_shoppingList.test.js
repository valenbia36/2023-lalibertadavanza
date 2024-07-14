const request = require("supertest");
const app = require("../app");
const {
  recipeModel,
  usersModel,
  foodModel,
  categoryModel,
  shoppingListModel,
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

test("Test 1", async () => {
  const testToken = await login("adminuser@admin.com");
  const foods = await createFoods(testToken);
  const response = await request(app)
    .post("/api/shoppingList/shopping-list")
    .send({
      weeklyTotal: foods.map((food) => ({
        foodId: food.foodId,
        weightConsumed: food.weightConsumed,
        quantityToBuy: 100,
      })),
    })
    .set("Authorization", "Bearer " + testToken);

  expect(response.status).toBe(200);
  expect(response.body.weeklyTotal).toHaveLength(foods.length);
  response.body.weeklyTotal.forEach((item, index) => {
    expect(item.foodId).toBe(foods[index]._id.toString());
    expect(item.weightConsumed).toBe(200);
    expect(item.quantityToBuy).toBe(100);
  });
});
