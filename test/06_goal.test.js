const request = require("supertest");
const app = require("../app");
const { goalModel } = require("../models");
const sinon = require("sinon");

beforeAll(async () => {
  await goalModel.deleteMany({});
});

let findStub;

test("Se creo el goal correctamente", async () => {
  const response = await request(app).post("/api/goals").send({
    name: "Meta 1",
    startDate: "2023-10-22T03:00:15.454Z",
    endDate: "2023-10-24T03:00:15.454Z",
    calories: 200,
    userId: "987654321",
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
