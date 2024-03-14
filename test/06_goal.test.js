const request = require("supertest");
const app = require("../app");
const { goalModel } = require("../models");
const sinon = require("sinon");
const jwt = require("jsonwebtoken");
beforeAll(async () => {
  await goalModel.deleteMany({});
});

let findStub;

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

test("Se creo el goal semanal correctamente", async () => {
  const testToken = generateTestToken();
  const response = await request(app)
    .post("/api/goals")
    .send({
      name: "Meta 1",
      startDate: "2024-10-22T03:00:15.454Z",
      endDate: "2024-10-24T03:00:15.454Z",
      calories: 200,
      recurrency: "monthly",
    })
    .set("Authorization", "Bearer " + testToken);
  expect(response.statusCode).toEqual(200);
});

test("Se creo el goal mensual correctamente", async () => {
  const testToken = generateTestToken();
  const response = await request(app)
    .post("/api/goals")
    .send({
      name: "Meta 1",
      startDate: "2025-10-22T03:00:15.454Z",
      endDate: "2025-10-24T03:00:15.454Z",
      calories: 200,
      recurrency: "weekly",
    })
    .set("Authorization", "Bearer " + testToken);
  expect(response.statusCode).toEqual(200);
});

test("[GET GOALS BY USER ID] Esto deberia retornar un 200", async () => {
  const testToken = generateTestToken();
  const response = await request(app)
    .post("/api/goals")
    .send({
      name: "Meta 1",
      startDate: "2023-10-22T03:00:15.454Z",
      endDate: "2023-10-24T03:00:15.454Z",
      calories: 200,
    })
    .set("Authorization", "Bearer " + testToken);

  const response1 = await request(app)
    .get("/api/goals")
    .set("Authorization", "Bearer " + testToken);
  expect(response1.statusCode).toEqual(200);
  const responseParsed = JSON.parse(response1.text);
  const categoryId = responseParsed.data._id;
});

test("[GET ACTIVE GOALS BY USER ID] Esto deberia retornar un 200", async () => {
  const testToken = generateTestToken();
  const response = await request(app)
    .post("/api/goals")
    .send({
      name: "Meta 1",
      startDate: "2023-10-22T03:00:15.454Z",
      endDate: "2023-10-24T03:00:15.454Z",
      calories: 200,
    })
    .set("Authorization", "Bearer " + testToken);

  const response1 = await request(app)
    .get("/api/goals/activeGoals")
    .set("Authorization", "Bearer " + testToken);
  expect(response1.statusCode).toEqual(200);
});

test("[GET GOALS BY USER ID WITH PROGRESS MONTHLY] Esto deberia retornar un 200", async () => {
  const testToken = generateTestToken();
  const response = await request(app)
    .post("/api/goals")
    .send({
      name: "Meta 1",
      startDate: "2023-10-22T03:00:15.454Z",
      endDate: "2023-10-24T03:00:15.454Z",
      calories: 200,
      recurrency: "Monthly",
    })
    .set("Authorization", "Bearer " + testToken);

  const response1 = await request(app)
    .get("/api/goals/goalsWithProgress")
    .set("Authorization", "Bearer " + testToken);
  expect(response1.statusCode).toEqual(200);
});

test("[GET GOALS BY USER ID WITH PROGRESS WEEKLY] Esto deberia retornar un 200", async () => {
  const testToken = generateTestToken();
  const response = await request(app)
    .post("/api/goals")
    .send({
      name: "Meta 1",
      startDate: "2023-10-22T03:00:15.454Z",
      endDate: "2023-10-24T03:00:15.454Z",
      calories: 200,
      recurrency: "Weekly",
    })
    .set("Authorization", "Bearer " + testToken);

  const response1 = await request(app)
    .get("/api/goals/goalsWithProgress/")
    .set("Authorization", "Bearer " + testToken);
  expect(response1.statusCode).toEqual(200);
});

test("[GET GOALS BY USER ID WITH PROGRESS] Esto deberia retornar un 200", async () => {
  const testToken = generateTestToken();
  const response = await request(app)
    .post("/api/goals")
    .send({
      name: "Meta 1",
      startDate: "2023-10-22T03:00:15.454Z",
      endDate: "2024-10-24T03:00:15.454Z",
      calories: 200,
      recurrency: "Weekly",
    })
    .set("Authorization", "Bearer " + testToken);

  const response1 = await request(app)
    .get("/api/goals/goalsWithProgress/")
    .set("Authorization", "Bearer " + testToken);
  expect(response1.statusCode).toEqual(200);
});

test("[DELETE GOAL BY ID] Esto deberia retornar un 200", async () => {
  const testToken = generateTestToken();
  const response = await request(app)
    .post("/api/goals")
    .send({
      name: "Meta 1",
      startDate: "2023-10-22T03:00:15.454Z",
      endDate: "2023-10-24T03:00:15.454Z",
      calories: 200,
    })
    .set("Authorization", "Bearer " + testToken);

  const responseParsed = JSON.parse(response.text);

  const response1 = await request(app)
    .delete("/api/goals/" + responseParsed.data._id)
    .set("Authorization", "Bearer " + testToken);
  expect(response1.statusCode).toEqual(200);
}, 1000);

test("[UPDATE GOAL BY ID] Esto deberia retornar un 200", async () => {
  const testToken = generateTestToken();
  const response = await request(app)
    .post("/api/goals")
    .send({
      name: "Meta 1",
      startDate: "2023-10-22T03:00:15.454Z",
      endDate: "2023-10-24T03:00:15.454Z",
      calories: 200,
    })
    .set("Authorization", "Bearer " + testToken);
  const responseParsed = JSON.parse(response.text);

  const response1 = await request(app)
    .put("/api/goals/" + responseParsed.data._id)
    .send({ name: "Nuevo nombre" })
    .set("Authorization", "Bearer " + testToken);
  expect(response1.statusCode).toEqual(200);
}, 1000);

test("[GET ACTIVE GOALS BY USER ID] Esto deberia retornar un 500", async () => {
  const testToken = generateTestToken();
  findStub = sinon.stub(goalModel, "find").throws(new Error("Database error"));

  const response = await request(app)
    .post("/api/goals")
    .send({
      name: "Meta 1",
      startDate: "2023-10-22T03:00:15.454Z",
      endDate: "2023-10-24T03:00:15.454Z",
      calories: 200,
    })
    .set("Authorization", "Bearer " + testToken);

  const response1 = await request(app)
    .get("/api/goals/activeGoals/")
    .set("Authorization", "Bearer " + testToken);
  expect(response1.statusCode).toEqual(500);
});

test("[GET GOALS BY USER ID WITH PROGRESS MONTHLY] Esto deberia retornar un 500", async () => {
  const testToken = generateTestToken();
  findStub = sinon.stub(goalModel, "find").throws(new Error("Database error"));
  const response = await request(app)
    .get("/api/goals/goalsWithProgress/")
    .set("Authorization", "Bearer " + testToken);
  expect(response.statusCode).toEqual(500);
});

test("[ERROR 500] No se creo el goal correctamente", async () => {
  const testToken = generateTestToken();
  sinon.stub(goalModel, "create").throws(new Error("Database error"));

  const response = await request(app)
    .post("/api/goals")
    .send({
      name: "Meta 1",
      startDate: "2023-10-22T03:00:15.454Z",
      endDate: "2023-10-24T03:00:15.454Z",
      calories: 200,
    })
    .set("Authorization", "Bearer " + testToken);

  expect(response.statusCode).toEqual(500);
});

test("[UPDATE GOAL BY ID] Esto deberia retornar un 500", async () => {
  const testToken = generateTestToken();
  sinon.stub(goalModel, "findOneAndUpdate").throws(new Error("Database error"));

  const response1 = await request(app)
    .put("/api/goals/1234")
    .send({ name: "Nuevo nombre" })
    .set("Authorization", "Bearer " + testToken);
  expect(response1.statusCode).toEqual(500);
}, 1000);

test("[GET GOALS BY USER ID] Esto deberia retornar un 500", async () => {
  const testToken = generateTestToken();
  const response1 = await request(app)
    .get("/api/goals/")
    .set("Authorization", "Bearer " + testToken);
  expect(response1.statusCode).toEqual(500);
});

test("[DELETE GOAL BY ID] Esto deberia retornar un 500", async () => {
  sinon.stub(goalModel, "delete").throws(new Error("Database error"));
  const response = await request(app).delete("/api/goals/1234");
  expect(response.statusCode).toEqual(500);
}, 1000);
