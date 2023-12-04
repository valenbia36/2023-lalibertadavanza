const request = require('supertest');
const sinon = require('sinon');
const app = require('../app');
const { usersModel } = require("../models");

let findOneStub;
let findOneAndUpdateStub;

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
            "weight": "70",
            "role": "user"
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

test("Esto deberia retornar un 401, ya que la password no es correcta", async() => {
    const response = await request(app)
    .post('/api/auth/login')
    .send(
        {
            "email":"adminuser@admin.com",
            "password":"error"
        }
    )
    expect(response.statusCode).toEqual(401);
})

test("Esto deberia retornar un 200", async() => {
    const response = await request(app)
    .get('/api/auth/users')
    expect(response.statusCode).toEqual(200);
})

test("Esto deberia retornar un 200", async() => {
    const response = await request(app)
    .get('/api/auth/users')
    expect(response.statusCode).toEqual(200);
})

test("Se creo y actualizo el usuario correctamente", async() => {
    const response = await request(app)
    .post('/api/auth/register')
    .send(
        {
            "firstName": "test",
            "lastName": "user",
            "email": "testuser@gmail.com",
            "password": "testuser",
            "sex": "male",
            "age": "23",
            "height": "1.80",
            "weight": "70",
            "role": "user"
        }
    )
    expect(response.statusCode).toEqual(200);

    const responseParsed = JSON.parse(response.text);

    const response1 = await request(app)
    .put('/api/auth/users/updatePassword/' + responseParsed.user._id)
    .send(
        {
            "password": "newPassword"
        }
    )
    expect(response1.statusCode).toEqual(200);
})

test("Se creo y obtuvo el usuario correctamente", async() => {
    const response = await request(app)
    .post('/api/auth/register')
    .send(
        {
            "firstName": "test",
            "lastName": "user",
            "email": "testuser1@gmail.com",
            "password": "testuser",
            "sex": "male",
            "age": "23",
            "height": "1.80",
            "weight": "70",
            "role": "user"
        }
    )
    expect(response.statusCode).toEqual(200);

    const responseParsed = JSON.parse(response.text);
    const response1 = await request(app)
    .get('/api/auth/users/' + responseParsed.user._id)
    expect(response1.statusCode).toEqual(200);
})

test("Se creo y obtuvo el usuario por email correctamente", async() => {
    const response = await request(app)
    .post('/api/auth/register')
    .send(
        {
            "firstName": "test",
            "lastName": "user",
            "email": "testuser999@gmail.com",
            "password": "testuser",
            "sex": "male",
            "age": "23",
            "height": "1.80",
            "weight": "70",
            "role": "user"
        }
    )
    expect(response.statusCode).toEqual(200);

    const response1 = await request(app)
    .get('/api/auth/users/email/testuser999@gmail.com')
    expect(response1.statusCode).toEqual(200);
})

test("Se creo y obtuvo el usuario por email correctamente", async() => {
    const response = await request(app)
    .post('/api/auth/register')
    .send(
        {
            "firstName": "test",
            "lastName": "user",
            "email": "testuser9999@gmail.com",
            "password": "testuser",
            "sex": "male",
            "age": "23",
            "height": "1.80",
            "weight": "70",
            "role": "user"
        }
    )
    expect(response.statusCode).toEqual(200);

    const responseParsed = JSON.parse(response.text);

    const response1 = await request(app)
    .put('/api/auth/users/' + responseParsed.user._id)
    .send({
        "firstName": "nuevo",
        "lastName": "nombre",
    })
    expect(response1.statusCode).toEqual(200);
})

test("Se creo y actualizo el usuario correctamente", async() => {
    const response = await request(app)
    .post('/api/auth/register')
    .send(
        {
            "firstName": "test99",
            "lastName": "user",
            "email": "testuser99@gmail.com",
            "password": "testuser",
            "sex": "male",
            "age": "23",
            "height": "1.80",
            "weight": "70",
            "role": "user"
        }
    )
    expect(response.statusCode).toEqual(200);

    const responseParsed = JSON.parse(response.text);

    const response1 = await request(app)
    .delete('/api/auth/users/' + responseParsed.user._id)
    expect(response1.statusCode).toEqual(200);
})

test("[LOGIN]Esto debe retornar un error 500", async () => {
    const requestBody = {
      email: 'test@example.com',
      password: 'password123',
    };

    findOneStub = sinon.stub(usersModel, 'findOne').throws(new Error('Database error'));

    const response = await request(app)
      .post('/api/auth/login')
      .send(requestBody);

    expect(response.status).toEqual(500);

    usersModel.findOne.restore();
  });

test('[REGISTER]Esto debe retornar un error 500', async () => {
    const requestBody = {
        "firstName": "test",
        "lastName": "user",
        "email": "adminuser@admin.com",
        "password": "adminuser",
        "sex": "male",
        "age": "23",
        "height": "1.80",
        "weight": "70",
        "role": "user"
    };

    sinon.stub(usersModel, 'create').throws(new Error('Database error'));

    const response = await request(app)
      .post('/api/auth/register')
      .send(requestBody);

    expect(response.status).toEqual(500);
  });

test('[DELETE]Esto debe retornar un error 500', async () => {

    sinon.stub(usersModel, 'delete').throws(new Error('Database error'));

    const response = await request(app)
      .delete('/api/auth/users/1234')

    expect(response.status).toEqual(500);
});

test('[GET USERS]Esto debe retornar un error 500"', async () => {

    sinon.stub(usersModel, 'find').throws(new Error('Database error'));

    const response = await request(app)
      .get('/api/auth/users')

    expect(response.status).toEqual(500);
});

test('[GET USER BY ID]Esto debe retornar un error 500"', async () => {

    findOneStub.throws(new Error('Database error'));

    const response = await request(app)
      .get('/api/auth/users/1234')

    expect(response.status).toEqual(500);
});

test('[GET USER BY EMAIL]Esto debe retornar un error 500"', async () => {

    sinon.stub(usersModel, 'findOne').throws(new Error('Database error'));

    const response = await request(app)
      .get('/api/auth/users/email/1234')

    expect(response.status).toEqual(500);
});

test('[UPDATE USER]Esto debe retornar un error 500"', async () => {

    findOneAndUpdateStub = sinon.stub(usersModel, 'findOneAndUpdate').throws(new Error('Database error'));

    const response = await request(app)
      .put('/api/auth/users/1234')
      .send({
        "firstName": "test"
      })

    expect(response.status).toEqual(500);
});

test('[UPDATE PASSWORD]Esto debe retornar un error 500"', async () => {

    const requestBody = {
        "password": "cambioDePassword"
    };

    findOneAndUpdateStub.throws(new Error('Database error'));

    const response = await request(app)
      .put('/api/auth/users/updatePassword/1234')
      .send(requestBody);

    expect(response.status).toEqual(500);
});