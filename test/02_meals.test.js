const request = require('supertest');
const app = require('../app');
const { mealModel } = require("../models");

beforeAll(async () => {
    await mealModel.deleteMany({});
});

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
            "calories":200
        }
    )
    expect(response.statusCode).toEqual(200);
})

test("Esto deberia retornar un 200", async() => {
    const response = await request(app)
    .get('/api/meals')
    expect(response.statusCode).toEqual(200);
})