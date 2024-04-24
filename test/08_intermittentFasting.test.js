const request = require("supertest");
const app = require("../app");
const { intermittentFastingModel } = require("../models");
const sinon = require("sinon");
const jwt = require("jsonwebtoken");
beforeAll(async () => {
  await intermittentFastingModel.deleteMany({});
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
test("User succesfully created an intermitent fasting", async () => {
  const testToken = await login("adminuser@admin.com");
  const response = await request(app)
    .post("/api/intermittentFasting")
    .send({
      startDateTime: "2023-10-22T03:00:15.454Z",
      endDateTime: "2024-10-23T05:00:15.454Z",
    })
    .set("Authorization", "Bearer " + testToken);
  expect(response.statusCode).toEqual(200);
  expect(
    intermittentFastingModel.findById(response._body.data._id)
  ).toBeTruthy();
});

test("[ERROR 501] Ya existe un ayuno intermitente en ese horario", async () => {
  const response = await request(app).post("/api/intermittentFasting").send({
    startDateTime: "2023-10-22T03:00:15.454Z",
    endDateTime: "2023-10-23T05:00:15.454Z",
    userId: "987654321",
    email: "adminuser@admin.com",
    userName: "Admin Admin",
  });
  expect(response.statusCode).toEqual(501);
});

test("Should retrieve active intermittent fastings correctly", async () => {
  const testToken = await login("adminuser@admin.com");

  // Create a new intermittent fasting
  const createResponse = await request(app)
    .post("/api/intermittentFasting")
    .send({
      startDateTime: "2023-10-22T03:00:15.454Z",
      endDateTime: "2024-10-23T05:00:15.454Z",
    })
    .set("Authorization", "Bearer " + testToken);
  expect(createResponse.statusCode).toEqual(200);

  // Retrieve active intermittent fastings
  const activeResponse = await request(app)
    .get("/api/intermittentFasting/active")
    .set("Authorization", "Bearer " + testToken);
  expect(activeResponse.statusCode).toEqual(200);

  // Ensure that there is at least one active intermittent fasting
  expect(activeResponse.body.filteredData.length).toBeGreaterThan(0);

  // Get the first active intermittent fasting
  const activeFasting = activeResponse.body.filteredData[0];

  // Convert dates to timestamps
  const currentDateTime = new Date().getTime();
  const startDateTime = new Date(activeFasting.startDateTime).getTime();
  const endDateTime = new Date(activeFasting.endDateTime).getTime();

  // Verify that the intermittent fasting has started but has not yet ended
  expect(startDateTime).toBeLessThanOrEqual(currentDateTime);
  expect(endDateTime).toBeGreaterThan(currentDateTime);
});

test("User deletes active intermitent fasting", async () => {
  const testToken = await login("adminuser@admin.com");
  const response = await request(app)
    .post("/api/intermittentFasting")
    .send({
      startDateTime: "2023-10-22T03:00:15.454Z",
      endDateTime: "2024-10-23T05:00:15.454Z",
    })
    .set("Authorization", "Bearer " + testToken);

  const responseParsed = JSON.parse(response.text);

  const response1 = await request(app)
    .delete("/api/intermittentFasting/active/" + responseParsed.data._id)
    .set("Authorization", "Bearer " + testToken);

  expect(response1.statusCode).toEqual(200);
  expect(
    intermittentFastingModel.findById(response._body.data._id)
  ).toBeTruthy();
});

test("[ERROR 500] No se elimino el intermittent fasting correctamente", async () => {
  const response = await request(app).post("/api/intermittentFasting").send({
    startDateTime: "2023-10-29T03:00:15.454Z",
    endDateTime: "2023-10-30T05:00:15.454Z",
    userId: "987654321",
  });

  const responseParsed = JSON.parse(response.text);

  sinon
    .stub(intermittentFastingModel, "delete")
    .throws(new Error("Database error"));

  const response1 = await request(app).delete(
    "/api/intermittentFasting/active/" + responseParsed.data._id
  );

  expect(response1.statusCode).toEqual(500);
});
// Falta no poder crear dos que se superpongan
test("Cant create two intermitent fastings on the same time span", async () => {
  const testToken = await login("adminuser@admin.com");

  // Create a new intermittent fasting
  const createResponse1 = await request(app)
    .post("/api/intermittentFasting")
    .send({
      startDateTime: "2023-10-22T03:00:15.454Z",
      endDateTime: "2024-10-23T05:00:15.454Z",
    })
    .set("Authorization", "Bearer " + testToken);
  expect(createResponse1.statusCode).toEqual(200);

  // Create a new intermittent fasting
  const createResponse2 = await request(app)
    .post("/api/intermittentFasting")
    .send({
      startDateTime: "2023-10-22T04:00:15.454Z",
      endDateTime: "2024-10-23T05:00:15.454Z",
    })
    .set("Authorization", "Bearer " + testToken);
  expect(createResponse2.statusCode).toEqual(501);
  expect(createResponse2._body.message).toEqual("CONFLICTING_FASTING_PERIOD");
});
// QUe no puedas crear endDate < startDate
test("Cant create an intermitent fasting with start date older than end date", async () => {
  const testToken = await login("adminuser@admin.com");

  // Create a new intermittent fasting
  const createResponse1 = await request(app)
    .post("/api/intermittentFasting")
    .send({
      startDateTime: "2024-10-24T03:00:15.454Z",
      endDateTime: "2024-10-23T05:00:15.454Z",
    })
    .set("Authorization", "Bearer " + testToken);
  expect(createResponse1.statusCode).toEqual(500);
  expect(createResponse1._body.message).toEqual(
    "ERROR_CREATE_INTERMITTENT_FASTING"
  );
});
test("[ERROR 500] No se creo el intermittent fasting correctamente", async () => {
  sinon
    .stub(intermittentFastingModel, "create")
    .throws(new Error("Database error"));

  const response = await request(app).post("/api/intermittentFasting").send({
    startDateTime: "2023-10-24T03:00:15.454Z",
    endDateTime: "2023-10-25T05:00:15.454Z",
    userId: "987654321",
  });

  expect(response.statusCode).toEqual(500);
});

test("[ERROR 500] No se obtuvieron los intermittent fastings activos correctamente", async () => {
  sinon
    .stub(intermittentFastingModel, "find")
    .throws(new Error("Database error"));

  const response = await request(app).get(
    "/api/intermittentFasting/active/987654321"
  );
  expect(response.statusCode).toEqual(500);
});

test("[ERROR 500] No se obtuvieron los intermittent fastings correctamente", async () => {
  const response = await request(app).get("/api/intermittentFasting/987654321");
  expect(response.statusCode).toEqual(500);
});
