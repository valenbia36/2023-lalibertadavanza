const request = require('supertest');
const app = require('../app');
const { foodModel } = require("../models");
const sinon = require('sinon');

beforeAll(async () => {
    await foodModel.deleteMany({});
});

test("Esto deberia retornar un 403", async() => {
    const response = await request(app)
    .post('/api/foods')
    .send(
        {
            "name":"",
            "calories":"10",
            "weight": "10",
            "category": "Carne"
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
            "calories": "2",
            "weight": "10",
            "category": "Carne"
        }
    )
    expect(response.statusCode).toEqual(200);
})

test("Se obtuvieron los alimentos correctamente [200]", async() => {
    const response = await request(app)
    .get('/api/foods')
    expect(response.statusCode).toEqual(200);
})

it('[GET FOODS]Esto deberia retornar un 500', async () => {
    sinon.stub(foodModel, 'find').throws(new Error('Database error'));

    const response = await request(app)
      .get('/api/foods');

    expect(response.status).toEqual(500);
}, 1000);

it('[CREATE FOOD]Esto deberia retornar un 500', async () => {
    sinon.stub(foodModel, 'create').throws(new Error('Database error'));

    const response = await request(app)
      .post('/api/foods')
      .send({
                "name": "Rucula",
                "calories": "2",
                "weight": "10",
                "category": "Carne"
            }
    );

    expect(response.status).toEqual(500);
});

test('[GET FOODS BY CATEGORY]Esto deberia retornar un 500', async () => {
    findStub.throws(new Error('Database error'));

    const response = await request(app)
    .get('/api/foods/:Carne');

    expect(response.status).toEqual(500);
});