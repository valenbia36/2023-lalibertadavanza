const request = require("supertest");
const app = require("../app");
const { foodModel } = require("../models");
const sinon = require("sinon");
const jwt = require("jsonwebtoken");
let findStub;

beforeAll(async () => {
  await foodModel.deleteMany({});
});
function generateTestToken() {
  const genericUserData = {
    userId: "genericUserId",
    firstName: "test",
    lastName: "user",
    email: "testuser@example.com",
    sex: "male",
    age: 25,
    height: 1.75,
    weight: 68,
  };

  const secretKey = "llave_secreta";
  const options = { expiresIn: "1h" };

  return jwt.sign({ _id: genericUserData.userId }, secretKey, options);
}

test("A food can't be created without a name", async () => {
  const testToken = generateTestToken();
  const response = await request(app)
    .post("/api/foods")
    .send({
      name: "",
      calories: "10",
      weight: "10",
      category: "Carne",
    })
    .set("Authorization", "Bearer " + testToken);
  expect(response.statusCode).toEqual(403);
});
test("A food can't be created without calories", async () => {
  const testToken = generateTestToken();
  const response = await request(app)
    .post("/api/foods")
    .send({
      name: "Carne",
      calories: "",
      weight: 10,
      category: "Carne",
    })
    .set("Authorization", "Bearer " + testToken);
  expect(response.statusCode).toEqual(403);
});
test("A food can't be created without weight", async () => {
  const testToken = generateTestToken();
  const response = await request(app)
    .post("/api/foods")
    .send({
      name: "Carne",
      calories: 10,
      weight: "",
      category: "Carne",
    })
    .set("Authorization", "Bearer " + testToken);
  expect(response.statusCode).toEqual(403);
});

test("Se creo el alimento correctamente", async () => {
  const testToken = generateTestToken();
  const foodToSend = {
    name: "Rucula",
    calories: 2,
    weight: 10,
    category: "Carne",
    carbs: 0,
    proteins: 0,
    fats: 0,
  };
  const response = await request(app)
    .post("/api/foods")
    .send(foodToSend)
    .set("Authorization", "Bearer " + testToken);
  expect(response.statusCode).toEqual(200);
  const responseParsed = JSON.parse(response.text);
  const foodId = responseParsed.data._id;
  const food = await foodModel.findById(foodId);
  expect(food).toBeTruthy();
});

test("[GET FOODS BY CATEGORY] Se obtuvieron los alimentos por categoria correctamente", async () => {
  const testToken = generateTestToken();
  const response = await request(app)
    .get("/api/foods/category/Carne")
    .set("Authorization", "Bearer " + testToken);
  expect(response.statusCode).toEqual(200);
});

test("Se obtuvieron los alimentos correctamente [200]", async () => {
  const testToken = generateTestToken();
  const response = await request(app)
    .get("/api/foods")
    .set("Authorization", "Bearer " + testToken);
  expect(response.statusCode).toEqual(200);
});

test("[GET FOODS]Esto deberia retornar un 500", async () => {
  const testToken = generateTestToken();
  findStub = sinon.stub(foodModel, "find").throws(new Error("Database error"));

  const response = await request(app)
    .get("/api/foods")
    .set("Authorization", "Bearer " + testToken);

  expect(response.status).toEqual(500);
}, 1000);

test("[CREATE FOOD]Esto deberia retornar un 500", async () => {
  const testToken = generateTestToken();
  sinon.stub(foodModel, "create").throws(new Error("Database error"));

  const response = await request(app)
    .post("/api/foods")
    .send({
      name: "Rucula",
      calories: "2",
      weight: "10",
      category: "Carne",
    })
    .set("Authorization", "Bearer " + testToken);

  expect(response.status).toEqual(500);
});

test("[GET FOODS BY CATEGORY]Esto deberia retornar un 500", async () => {
  const testToken = generateTestToken();
  sinon.stub(foodModel, "find").throws(new Error("Database error"));

  const response = await request(app)
    .get("/api/foods/category/Verdura")
    .set("Authorization", "Bearer " + testToken);

  expect(response.status).toEqual(500);
});
