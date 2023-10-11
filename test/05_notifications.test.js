const request = require("supertest");
const app = require("../app");
const sinon = require("sinon");

test("[SEND NOTIFICATION OK] Should send a reset password email successfully", async () => {

    const response = await request(app)
    .post("/api/notifications/sendEmail")
    .send({
        email: 'user@example.com',
        token: 'sampleToken',
        userName: 'John Doe',
    })

    expect(response.statusCode).toEqual(200);
});