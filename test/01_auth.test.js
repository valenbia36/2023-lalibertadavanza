const request = require('supertest');
const app = require('../app');
const { usersModel } = require("../models");

beforeAll(async () => {
    await usersModel.deleteMany({});
});

test("Esto deberia retornar un 404", async() => {
    const response = await request(app)
    .post('/api/auth/login')
    .send(
        {
            "email":"noexiste@esteusuario.com",
            "password":"error"
        }
    )
    expect(response.statusCode).toEqual(404);
})

test("Se creo el usuario correctamente", async() => {
    const response = await request(app)
    .post('/api/auth/register')
    .send(
        {
            "firstName": "test",
            "lastName": "user",
            "email": "adminuser@admin.com",
            "password": "adminuser",
            "sex": "male",
            "age": "23",
            "height": "1.80",
            "weight": "70"
        }
    )
    expect(response.statusCode).toEqual(200);
})

test("Esto deberia retornar un 200", async() => {
    const response = await request(app)
    .post('/api/auth/login')
    .send(
        {
            "email":"adminuser@admin.com",
            "password":"adminuser"
        }
    )
    expect(response.statusCode).toEqual(200);
})