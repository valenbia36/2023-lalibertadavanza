const request = require("supertest");
const sinon = require("sinon");
const app = require("../app");
const { usersModel, intermittentFastingModel } = require("../models");
const {
  sendIntermittentFastingNotificationEmail,
} = require("../controllers/notifications");
const rewire = require("rewire");
const schedule = require("node-schedule");
const jwt = require("jsonwebtoken");
async function register(email) {
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
}

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

test("[SEND NOTIFICATION OK] Should send a reset password email successfully", async () => {
  await register("testuser@test.com");
  const response = await request(app).get(
    "/api/auth/users/email/" + "testuser@test.com"
  );
  const userInfo = response.body.data;
  const response1 = await request(app)
    .post("/api/notifications/sendEmail")
    .send({
      email: "testuser@test.com",
      userName: userInfo.firstName,
      userId: userInfo._id,
      url: "https://example.com",
    });
  expect(response1.status).toBe(200);
  expect(response1.body.message).toEqual("Email Sent");
  expect(response1.body.success).toEqual(true);
}, 100000);

test("[SEND NOTIFICATION OK] One hour alert email scheduled after creating an intermitent fasting ", async () => {
  const testToken = await login("testuser@test.com");
  let scheduleJobStub;
  let sendEmailSpy;
  let notificationsModule;
  notificationsModule = rewire("../controllers/notifications");

  // Mock de schedule.scheduleJob
  scheduleJobStub = sinon
    .stub(schedule, "scheduleJob")
    .callsFake((time, callback) => {
      // Llamar la función inmediatamente para fines de prueba
      callback();
    });

  // Mock de user data y intermittent fasting model
  const userId = "userId123";
  const userEmail = "testuser@test.com";
  const userName = "Test User";

  sinon.stub(usersModel, "findById").resolves({
    _id: userId,
    email: userEmail,
    firstName: userName,
  });

  sinon.stub(intermittentFastingModel, "findOne").resolves(null);
  sinon.stub(intermittentFastingModel, "create").resolves({
    _id: "fastingId123",
    startDateTime: new Date(),
    endDateTime: new Date(Date.now() + 3600 * 1000), // 1 hora después
    userId: userId,
  });

  // Realiza la solicitud POST usando supertest
  const response = await request(app)
    .post("/api/intermittentFasting")
    .send({
      startDateTime: new Date(),
      endDateTime: new Date(Date.now() + 3600 * 1000), // 1 hora después
    })
    .set("Authorization", "Bearer " + testToken); // Asegúrate de pasar un token válido

  // Verificar el estado de la respuesta
  expect(response.status).toBe(200);
  expect(response.body.data).toHaveProperty("_id");

  // Verificar que scheduleJob se haya llamado correctamente
  expect(scheduleJobStub.calledOnce).toBe(true);

  const scheduleCall = scheduleJobStub.firstCall;
  const scheduledTime = new Date(scheduleCall.args[0]);
  const expectedTime = new Date(Date.now() + 3600 * 1000 - 60 * 60000);

  // Comparar horas y minutos
  expect(scheduledTime.getUTCHours()).toEqual(expectedTime.getUTCHours());
  expect(scheduledTime.getUTCMinutes()).toEqual(expectedTime.getUTCMinutes());
}, 100000);
