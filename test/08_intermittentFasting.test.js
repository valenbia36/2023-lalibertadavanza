const request = require("supertest");
const app = require("../app");
const { intermittentFastingModel } = require("../models");
const sinon = require("sinon");

beforeAll(async () => {
  await intermittentFastingModel.deleteMany({});
});

test("Se creo el intermittent fasting correctamente", async () => {
    const response = await request(app).post("/api/intermittentFasting").send({
      startDateTime: "2023-10-22T03:00:15.454Z",
      endDateTime: "2023-10-23T03:00:15.454Z",
      userId: "987654321"
    });
    expect(response.statusCode).toEqual(200);
});

test("Se obtuvieron los intermittent fastings activos correctamente", async () => {
    const response = await request(app).get("/api/intermittentFasting/active/987654321");
    expect(response.statusCode).toEqual(200);
});

test("Se obtuvieron los intermittent fastings correctamente", async () => {
    const response = await request(app).get("/api/intermittentFasting/987654321");
    expect(response.statusCode).toEqual(200);
});

test("[ERROR 500] No se creo el intermittent fasting correctamente", async () => {

    sinon.stub(intermittentFastingModel, 'create').throws(new Error('Database error'));

    const response = await request(app).post("/api/intermittentFasting").send({
      startDateTime: "2023-10-22T03:00:15.454Z",
      endDateTime: "2023-10-23T03:00:15.454Z",
      userId: "987654321"
    });
    expect(response.statusCode).toEqual(500);
});

test("[ERROR 500] No se obtuvieron los intermittent fastings activos correctamente", async () => {

    sinon.stub(intermittentFastingModel, 'find').throws(new Error('Database error'));

    const response = await request(app).get("/api/intermittentFasting/active/987654321");
    expect(response.statusCode).toEqual(500);
});

test("[ERROR 500] No se obtuvieron los intermittent fastings correctamente", async () => {
    const response = await request(app).get("/api/intermittentFasting/987654321");
    expect(response.statusCode).toEqual(500);
});
