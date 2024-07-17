const request = require("supertest");
const sinon = require("sinon");
const app = require("../app");
const { usersModel } = require("../models");
const {
  sendIntermittentFastingNotificationEmail,
} = require("../controllers/notifications");
const jwt = require("jsonwebtoken");
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

test("[SEND NOTIFICATION OK] Should send a reset password email successfully", async () => {
  const response = await request(app)
    .post("/api/notifications/sendEmail")
    .send({
      email: "vbianchi16@gmail.com",
      token: "sampleToken",
      userId: "a7s6745f",
      userName: "John Doe",
      url: "url",
    });

  expect(response.statusCode).toEqual(200);
}, 10000);

test("Hola", async () => {
  const reqUpdateUser = {
    body: {
      email: "vbianchi16@gmail.com",
      userName: "userName",
    },
  };

  const resUpdateUser = {
    send: (data) => {},
    status: (statusCode) => {},
  };

  const response = await sendIntermittentFastingNotificationEmail(
    reqUpdateUser,
    resUpdateUser
  );
  console.log(response);

  //....Agregar assert
});
