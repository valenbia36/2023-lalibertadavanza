const request = require('supertest');
const sinon = require('sinon');
const app = require('../app');
const { usersModel } = require("../models");

test("[SEND NOTIFICATION OK] Should send a reset password email successfully", async () => {
  const response = await request(app)
    .post("/api/notifications/sendEmail")
    .send({
      email: "user@example.com",
      token: "sampleToken",
      userName: "John Doe",
    });

  expect(response.statusCode).toEqual(200);
});

test("[VALIDATE TOKEN OK] Should send a reset password email successfully", async () => {
  const response = await request(app).post("/api/auth/register").send({
    firstName: "test99",
    lastName: "user",
    email: "testuser99@gmail.com",
    password: "testuser",
    sex: "male",
    age: "23",
    height: "1.80",
    weight: "70",
    secretToken: "1234",
  });

  const response1 = await request(app).get(
    "/api/notifications/validateToken/1234"
  );

  expect(response1.statusCode).toEqual(200);
});

test("[VALIDATE TOKEN NO OK] Should send a reset password email successfully", async () => {

    sinon.stub(usersModel, "findOne").throws(new Error("Database error"));
  
    const response1 = await request(app).get(
      "/api/notifications/validateToken/1234"
    );
  
    expect(response1.statusCode).toEqual(500);
  }, 1000);
