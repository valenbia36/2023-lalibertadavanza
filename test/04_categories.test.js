const request = require("supertest");
const app = require("../app");
const { categoryModel } = require("../models");
const sinon = require("sinon");
const jwt = require("jsonwebtoken");
beforeAll(async () => {
  await categoryModel.deleteMany({});
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

  return jwt.sign(genericUserData, secretKey, options);
}
test("Esto deberia retornar un 403", async () => {
  const response = await request(app).post("/api/category").send({
    name: "",
  });
  expect(response.statusCode).toEqual(403);
});

test("Se creo la categoria correctamente", async () => {
  const response = await request(app).post("/api/category").send({
    name: "Verduras",
  });
  expect(response.statusCode).toEqual(200);
});

test("Se obtuvieron las categorias correctamente [200]", async () => {
  const response = await request(app).get("/api/category");
  expect(response.statusCode).toEqual(200);
});

test("[CREATE CATEGORY] Esto debe retornar un error 500", async () => {
  sinon.stub(categoryModel, "create").throws(new Error("Database error"));

  const response = await request(app).post("/api/category").send({
    name: "Verduras",
  });
  expect(response.statusCode).toEqual(500);
});

test("[GET CATEGORIES] Esto debe retornar un error 500", async () => {
  sinon.stub(categoryModel, "find").throws(new Error("Database error"));

  const response = await request(app).get("/api/category");
  expect(response.statusCode).toEqual(500);
});
