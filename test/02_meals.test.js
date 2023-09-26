const request = require('supertest');
const app = require('../app');
const { mealModel } = require("../models");
const sinon = require('sinon');

beforeAll(async () => {
    await mealModel.deleteMany({});
});

let findStub;

test("Esto deberia retornar un 403", async() => {
    const response = await request(app)
    .post('/api/meals')
    .send(
        {
            "name":"",
            "foods":[],
            "date" : "20/10/1998",
            "hour":"20:15",
            "calories":200
        }
    )
    expect(response.statusCode).toEqual(403);
})

test("Se creo la comida correctamente", async() => {
    const response = await request(app)
    .post('/api/meals')
    .send(
        {
            "name": "Carne con papas",
            "foods": [
                {
                    "name" : "Papa",
                    "calories": "10",
                    "quantity":1
                },
                {
                    "name" : "Lomo",
                    "calories": "20",
                    "quantity":1
                }
            ],
            "date" : "20/10/1998",
            "hour":"20:15",
            "calories":200,
            "userId": "987654321"
        }
    )
    expect(response.statusCode).toEqual(200);
})

test("Esto deberia retornar un 200", async() => {
    const response = await request(app)
    .get('/api/meals')
    expect(response.statusCode).toEqual(200);
})

test("Esto deberia retornar un 200", async() => {
    const response = await request(app)
    .get('/api/meals/user/987654321')
    expect(response.statusCode).toEqual(200);
})

test('[GET MEALS]Esto deberia retornar un 500', async () => {
    findStub =sinon.stub(mealModel, 'find').throws(new Error('Database error'));

    const response = await request(app)
    .get('/api/meals');
    expect(response.status).toEqual(500);
});

test('[GET MEALS BY USER ID]Esto deberia retornar un 500', async () => {
    findStub.throws(new Error('Database error'));

    const response = await request(app)
    .get('/api/meals/user/123');

    expect(response.status).toEqual(500);
});

test('[CREATE MEAL]Esto deberia retornar un 500', async () => {
    sinon.stub(mealModel, 'create').throws(new Error('Database error'));

    const response = await request(app)
    .post('/api/meals')
    .send(
        {           
            "name": "Carne con papas",
            "foods": [
                {
                    "name" : "Papa",
                    "calories": "10",
                    "quantity":1
                },
                {
                    "name" : "Lomo",
                    "calories": "20",
                    "quantity":1
                }
            ],
            "date" : "20/10/1998",
            "hour":"20:15",
            "calories":200,
            "userId": "987654321"
        });

    expect(response.status).toEqual(500);
  });