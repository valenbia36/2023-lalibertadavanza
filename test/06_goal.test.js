const request = require("supertest");
const app = require("../app");
const { goalModel } = require("../models");
const sinon = require("sinon");

beforeAll(async () => {
  await goalModel.deleteMany({});
});

test("Se creo el goal semanal correctamente", async () => {
  const response = await request(app).post("/api/goals").send({
    name: "Meta 1",
    startDate: "2024-10-22T03:00:15.454Z",
    endDate: "2024-10-24T03:00:15.454Z",
    calories: 200,
    userId: "987654321",
    recurrency: "monthly"
  });
  expect(response.statusCode).toEqual(200);
});

test("Se creo el goal mensual correctamente", async () => {
  const response = await request(app).post("/api/goals").send({
    name: "Meta 1",
    startDate: "2025-10-22T03:00:15.454Z",
    endDate: "2025-10-24T03:00:15.454Z",
    calories: 200,
    userId: "987654321",
    recurrency: "weekly"
  });
  expect(response.statusCode).toEqual(200);
});

test("[GET GOALS BY USER ID] Esto deberia retornar un 200", async () => {
  const response = await request(app).post("/api/goals").send({
    name: "Meta 1",
    startDate: "2023-10-22T03:00:15.454Z",
    endDate: "2023-10-24T03:00:15.454Z",
    calories: 200,
    userId: "987654321",
  });

  const response1 = await request(app).get("/api/goals/987654321");
  expect(response1.statusCode).toEqual(200);
});

test("[GET ACTIVE GOALS BY USER ID] Esto deberia retornar un 200", async () => {
  const response = await request(app).post("/api/goals").send({
    name: "Meta 1",
    startDate: "2023-10-22T03:00:15.454Z",
    endDate: "2023-10-24T03:00:15.454Z",
    calories: 200,
    userId: "987654321",
  });

  const response1 = await request(app).get("/api/goals/activeGoals/987654321");
  expect(response1.statusCode).toEqual(200);
});

test("[GET GOALS BY USER ID WITH PROGRESS] Esto deberia retornar un 200", async () => {
  const response = await request(app).post("/api/goals").send({
    name: "Meta 1",
    startDate: "2023-10-22T03:00:15.454Z",
    endDate: "2023-10-24T03:00:15.454Z",
    calories: 200,
    userId: "987654321",
  });

  const response1 = await request(app).get(
    "/api/goals/goalsWithProgress/987654321"
  );
  expect(response1.statusCode).toEqual(200);
});

test("[DELETE GOAL BY ID] Esto deberia retornar un 200", async () => {
  const response = await request(app).post("/api/goals").send({
    name: "Meta 1",
    startDate: "2023-10-22T03:00:15.454Z",
    endDate: "2023-10-24T03:00:15.454Z",
    calories: 200,
    userId: "987654321",
  });

  const responseParsed = JSON.parse(response.text);

  const response1 = await request(app).delete(
    "/api/goals/" + responseParsed.data._id
  );
  expect(response1.statusCode).toEqual(200);
}, 1000);

test("[UPDATE GOAL BY ID] Esto deberia retornar un 200", async () => {
  const response = await request(app).post("/api/goals").send({
    name: "Meta 1",
    startDate: "2023-10-22T03:00:15.454Z",
    endDate: "2023-10-24T03:00:15.454Z",
    calories: 200,
    userId: "987654321",
  });

  const responseParsed = JSON.parse(response.text);

  const response1 = await request(app)
    .put("/api/goals/" + responseParsed.data._id)
    .send({ name: "Nuevo nombre" });
  expect(response1.statusCode).toEqual(200);
}, 1000);

test("[GET ACTIVE GOALS BY USER ID] Esto deberia retornar un 500", async () => {
  sinon.stub(goalModel, "find").throws(new Error("Database error"));

  const response = await request(app).post("/api/goals").send({
    name: "Meta 1",
    startDate: "2023-10-22T03:00:15.454Z",
    endDate: "2023-10-24T03:00:15.454Z",
    calories: 200,
    userId: "987654321",
  });

  const response1 = await request(app).get("/api/goals/activeGoals/987654321");
  expect(response1.statusCode).toEqual(500);
});

test("[ERROR 500] No se creo el goal correctamente", async () => {
  sinon.stub(goalModel, "create").throws(new Error("Database error"));

  const response = await request(app).post("/api/goals").send({
    name: "Meta 1",
    startDate: "2023-10-22T03:00:15.454Z",
    endDate: "2023-10-24T03:00:15.454Z",
    calories: 200,
    userId: "987654321",
  });

  expect(response.statusCode).toEqual(500);
});

test("[UPDATE GOAL BY ID] Esto deberia retornar un 500", async () => {
  sinon.stub(goalModel, "findOneAndUpdate").throws(new Error("Database error"));

  const response1 = await request(app)
    .put("/api/goals/1234")
    .send({ name: "Nuevo nombre" });
  expect(response1.statusCode).toEqual(500);
}, 1000);

test("[GET GOALS BY USER ID] Esto deberia retornar un 500", async () => {
  const response1 = await request(app).get("/api/goals/987654321");
  expect(response1.statusCode).toEqual(500);
});
