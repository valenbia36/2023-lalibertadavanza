const request = require("supertest");
const app = require("../app");
const { mealModel2, usersModel } = require("../models");
const sinon = require("sinon");
const jwt = require("jsonwebtoken");

beforeAll(async () => {
  await mealModel2.deleteMany({});
});

async function login() {
  const response = await request(app).post("/api/auth/register").send({
    // se registra
    firstName: "test",
    lastName: "user",
    email: "adminuser@admin.com",
    password: "adminuser",
    sex: "male",
    age: "23",
    height: "1.80",
    weight: "70",
  });
  const response1 = await request(app).post("/api/auth/login").send({
    // se logea para obtener token
    email: "adminuser@admin.com",
    password: "adminuser",
  });
  return response1._body.token;
}

async function createFoods(token) {
  const foodToSend1 = {
    name: "Lomo",
    calories: 2,
    weight: 10,
    category: "Carne",
    carbs: 0,
    proteins: 0,
    fats: 0,
  };
  const foodToSend2 = {
    name: "Vacio",
    calories: 2,
    weight: 10,
    category: "Carne",
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

test("A meal cannot be created without name", async () => {
  const testToken = await login();
  const foods = await createFoods(testToken);
  const response = await request(app)
    .post("/api/meals2")
    .send({
      name: "Asado",
      foods: foods,
      date: new Date(),
      hour: "20:15",
      calories: 200,
    })
    .set("Authorization", "Bearer " + testToken);
  expect(response.statusCode).toEqual(200);
  const response1 = await request(app)
    .get("/api/meals2/user")
    .set("Authorization", "Bearer " + testToken);
  expect(response1.statusCode).toEqual(200);
  //console.log(response1._body.data);
});
