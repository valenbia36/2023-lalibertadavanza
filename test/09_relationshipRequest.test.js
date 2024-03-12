const request = require("supertest");
const sinon = require("sinon");
const app = require("../app");
const { relationshipRequestModel } = require("../models");
const { usersModel } = require("../models");
const jwt = require("jsonwebtoken");
let findStubAuth;
let findStubRelationshipRequest;

let user;
let nutricionist;
let relationshipRequest;

test("[200] Se creo la solicitud de relacion correctamente", async () => {
  const response = await request(app).post("/api/auth/register").send({
    firstName: "Usuario",
    lastName: "Prueba",
    email: "usuario@prueba.com",
    password: "usuarioprueba",
    sex: "male",
    age: "23",
    height: "1.80",
    weight: "70",
    role: "user",
  });
  expect(response.statusCode).toEqual(200);

  const response1 = await request(app).post("/api/auth/register").send({
    firstName: "Nutricionista",
    lastName: "Prueba",
    email: "nutricionista@prueba.com",
    password: "nutricionistaprueba",
    sex: "male",
    age: "23",
    height: "1.80",
    weight: "70",
    role: "nutritionist",
  });
  expect(response1.statusCode).toEqual(200);

  const responseParsed = JSON.parse(response.text);
  user = responseParsed.user;
  const responseParsed1 = JSON.parse(response1.text);
  nutricionist = responseParsed1.user;

  const response2 = await request(app)
    .post("/api/relationshipRequest/create")
    .send({
      nutritionist: nutricionist._id,
      user: user._id,
      status: "Sent",
      nutritionistUserName:
        nutricionist.firstName + " " + nutricionist.lastName,
      nutritionistEmail: nutricionist.email,
      userName: user.firstName + " " + user.lastName,
    });
  expect(response2.statusCode).toEqual(200);
  const responseParsed2 = JSON.parse(response2.text);
  relationshipRequest = responseParsed2.data;
});

test("[200] Se obtuvieron todas las solicitudes de relacion correctamente", async () => {
  const response = await request(app).get(
    "/api/relationshipRequest/getRelationshipRequest"
  );
  expect(response.statusCode).toEqual(200);
});

test("[200] Se obtuvieron todas las solicitudes de relacion segun el user id correctamente", async () => {
  const response = await request(app).get(
    "/api/relationshipRequest/getRelationshipRequestByUserId/" + user._id
  );
  expect(response.statusCode).toEqual(200);
});

test("[200] Se obtuvieron todas las solicitudes de relacion enviadas segun el user id correctamente", async () => {
  const response = await request(app).get(
    "/api/relationshipRequest/getSentRelationshipRequestByUserId/" + user._id
  );
  expect(response.statusCode).toEqual(200);
});

test("[200] Se obtuvieron todas las solicitudes de relacion segun el nutritionist id correctamente", async () => {
  const response = await request(app).get(
    "/api/relationshipRequest/getRelationshipRequestByNutritionistId/" +
      nutricionist._id
  );
  expect(response.statusCode).toEqual(200);
});

test("[200] Se actualizo el estado de la solicitud de relacion correctamente", async () => {
  const response = await request(app)
    .put("/api/relationshipRequest/update/" + relationshipRequest._id)
    .send({
      status: "Accepted",
      nutritionistId: nutricionist._id,
      userId: user._id,
    });
  expect(response.statusCode).toEqual(200);
});

test("[200] Se obtuvieorn los pacientes para el nutritionist id correctamente", async () => {
  const response = await request(app).get(
    "/api/auth/patientsByNutritionistId/" + nutricionist._id
  );
  expect(response.statusCode).toEqual(200);
});

test("[200] Se obtuvo el nutricionista para el user id correctamente", async () => {
  const response = await request(app).get(
    "/api/auth/nutritionistByUserId/" + user._id
  );
  expect(response.statusCode).toEqual(200);
});

test("[200] Se obtuvieron los nutricionistas correctamente", async () => {
  const response = await request(app).get("/api/auth/nutritionistUsers");
  expect(response.statusCode).toEqual(200);
});

test("[500] Error al obtener los nutricionistas", async () => {
  findStubAuth = sinon
    .stub(usersModel, "find")
    .throws(new Error("Database error"));
  const response = await request(app).get("/api/auth/nutritionistUsers");
  expect(response.statusCode).toEqual(500);
});

test("[500] Error al obtener los nutricionistas", async () => {
  findStubAuth.throws(new Error("Database error"));
  const response = await request(app).get(
    "/api/auth/patientsByNutritionistId/1234"
  );
  expect(response.statusCode).toEqual(500);
});

test("[500] Error al obtener el nutricionista para el user id", async () => {
  sinon.stub(usersModel, "findById").throws(new Error("Database error"));
  const response = await request(app).get(
    "/api/auth/nutritionistByUserId/1234"
  );
  expect(response.statusCode).toEqual(500);
});

test("[500] Error al asignar el nutricionista", async () => {
  sinon
    .stub(usersModel, "findByIdAndUpdate")
    .throws(new Error("Database error"));
  const response = await request(app).put("/api/auth/assign-nutritionist/1234");
  expect(response.statusCode).toEqual(500);
});

test("[500] Hubo un error al crear la solicitud de relacion", async () => {
  sinon
    .stub(relationshipRequestModel, "create")
    .throws(new Error("Database error"));
  const response = await request(app).post("/api/relationshipRequest/create");
  expect(response.statusCode).toEqual(500);
});

test("[500] Hubo un error al obtener las solicitud de relacion", async () => {
  findStubRelationshipRequest = sinon
    .stub(relationshipRequestModel, "find")
    .throws(new Error("Database error"));
  const response = await request(app).get(
    "/api/relationshipRequest/getRelationshipRequest"
  );
  expect(response.statusCode).toEqual(500);
});

test("[500] Hubo un error al obtener las solicitud de relacion por user id", async () => {
  findStubRelationshipRequest.throws(new Error("Database error"));
  const response = await request(app).get(
    "/api/relationshipRequest/getRelationshipRequestByUserId/12345"
  );
  expect(response.statusCode).toEqual(500);
});

test("[500] Hubo un error al obtener las solicitud de relacion enviadas por user id", async () => {
  findStubRelationshipRequest.throws(new Error("Database error"));
  const response = await request(app).get(
    "/api/relationshipRequest/getSentRelationshipRequestByUserId/12345"
  );
  expect(response.statusCode).toEqual(500);
});

test("[500] Hubo un error al obtener todas las solicitudes de relacion segun el nutritionist id", async () => {
  findStubRelationshipRequest.throws(new Error("Database error"));
  const response = await request(app).get(
    "/api/relationshipRequest/getRelationshipRequestByNutritionistId/1234"
  );
  expect(response.statusCode).toEqual(500);
});

test("[200] Hubo un error al actualizar el estado de la solicitud de relacion", async () => {
  sinon
    .stub(relationshipRequestModel, "findByIdAndUpdate")
    .throws(new Error("Database error"));

  const response = await request(app)
    .put("/api/relationshipRequest/update/1234")
    .send({
      status: "Accepted",
      nutritionistId: nutricionist._id,
      userId: user._id,
    });
  expect(response.statusCode).toEqual(500);
});
