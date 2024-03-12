const request = require("supertest");
const app = require("../app");
const { waterGlassModel } = require("../models");
const sinon = require("sinon");
const jwt = require("jsonwebtoken");
beforeAll(async () => {
  await waterGlassModel.deleteMany({});
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
test("Se creo el water glass correctamente", async () => {
  const response = await request(app).post("/api/waterGlass").send({
    startDate: "2023-10-22T03:00:15.454Z",
    userId: "987654321",
  });
  expect(response.statusCode).toEqual(200);
});

test("Se obtuvieron los water glass for user id by day correctamente", async () => {
  const response = await request(app).get(
    "/api/waterGlass/countByDay/987654321"
  );
  expect(response.statusCode).toEqual(200);
});

test("Se obtuvieron los water glass by user id correctamente", async () => {
  const response = await request(app).get("/api/waterGlass/987654321");
  expect(response.statusCode).toEqual(200);
});

test("[ERROR 500] No se creo el water glass correctamente", async () => {
  sinon.stub(waterGlassModel, "create").throws(new Error("Database error"));

  const response = await request(app).post("/api/waterGlass").send({
    startDate: "2023-10-22T03:00:15.454Z",
    userId: "987654321",
  });
  expect(response.statusCode).toEqual(500);
});

test("[ERROR 500] No se obtuvieron los water glass for user id by day correctamente", async () => {
  sinon.stub(waterGlassModel, "aggregate").throws(new Error("Database error"));
  const response = await request(app).get(
    "/api/waterGlass/countByDay/987654321"
  );
  expect(response.statusCode).toEqual(500);
});

test("[ERROR 500] No se obtuvieron los water glass by user id correctamente", async () => {
  sinon.stub(waterGlassModel, "find").throws(new Error("Database error"));
  const response = await request(app).get("/api/waterGlass/987654321");
  expect(response.statusCode).toEqual(500);
});
