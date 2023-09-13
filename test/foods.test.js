const request = require('supertest');
const app = require('../app');
const { foodModel } = require("../models");

beforeAll(async () => {
    await foodModel.deleteMany({});
});

test("Esto deberia retornar un 403", async() => {
    const response = await request(app)
    .post('/api/foods')
    .send(
        {
            "name":"",
            "calories":"10"
        }
    )
    expect(response.statusCode).toEqual(403);
})

test("Se creo el alimento correctamente", async() => {
    const response = await request(app)
    .post('/api/foods')
    .send(
        {
            "name": "Rucula",
            "calories": "2"
        }
    )
    expect(response.statusCode).toEqual(200);
})
