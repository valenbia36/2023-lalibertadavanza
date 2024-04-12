const request = require("supertest");
const app = require("../app");
const { mealModel2, usersModel, foodModel } = require("../models");
const sinon = require("sinon");
const jwt = require("jsonwebtoken");
const users = require("../models/users");

beforeAll(async () => {
  await mealModel2.deleteMany({});
  await foodModel.deleteMany({});
  await usersModel.deleteMany({});
});

async function login() {
  const response = await request(app).post("/api/auth/register").send({
    // se registra
    firstName: "test",
    lastName: "user",
    email: "adminuser@admin.com",
    password: "adminuser",
    sex: "male",
    age: "23",
    height: "1.80",
    weight: "70",
  });
  const response1 = await request(app).post("/api/auth/login").send({
    // se logea para obtener token
    email: "adminuser@admin.com",
    password: "adminuser",
  });
  return response1._body.token;
}

async function login2() {
  const response = await request(app).post("/api/auth/register").send({
    // se registra
    firstName: "test",
    lastName: "user2",
    email: "adminuser2@admin.com",
    password: "adminuser",
    sex: "male",
    age: "23",
    height: "1.80",
    weight: "70",
  });
  const response1 = await request(app).post("/api/auth/login").send({
    // se logea para obtener token
    email: "adminuser2@admin.com",
    password: "adminuser",
  });
  return response1._body.token;
}

async function createFoods(token) {
  const foodToSend1 = {
    name: "Lomo",
    calories: 2,
    weight: 10,
    category: "Carne",
    carbs: 0,
    proteins: 0,
    fats: 0,
  };
  const foodToSend2 = {
    name: "Vacio",
    calories: 2,
    weight: 10,
    category: "Carne",
    carbs: 10,
    proteins: 10,
    fats: 10,
  };
  const response = await request(app)
    .post("/api/foods")
    .send(foodToSend1)
    .set("Authorization", "Bearer " + token);
  const response1 = await request(app)
    .post("/api/foods")
    .send(foodToSend2)
    .set("Authorization", "Bearer " + token);
  //console.log(response1._body);
  let foods = [
    { foodId: response._body.data._id, weightConsumed: 100 },
    { foodId: response1._body.data._id, weightConsumed: 200 },
  ];
  return foods;
}

test("POST request for a user should return a 200 and should be retrieved with a GET request", async () => {
  const testToken = await login();
  const foods = await createFoods(testToken);
  const response = await request(app)
    .post("/api/meals2")
    .send({
      name: "Asado",
      foods: foods,
      date: new Date(),
      hour: "20:15",
    })
    .set("Authorization", "Bearer " + testToken);
  expect(response.statusCode).toEqual(200);
  const response1 = await request(app)
    .get("/api/meals2/user")
    .set("Authorization", "Bearer " + testToken);
  expect(response1.statusCode).toEqual(200);
  expect(response1._body.data[0].name).toEqual("Asado");
  expect(response1._body.data[0].totalCalories).toEqual(60);
  expect(response1._body.data[0].totalFats).toEqual(200);
  expect(response1._body.data[0].totalCarbs).toEqual(200);
  expect(response1._body.data[0].totalProteins).toEqual(200);
});

test("A meal cannot be created without name", async () => {
  const testToken = await login();
  const foods = await createFoods(testToken);
  const response = await request(app)
    .post("/api/meals2")
    .send({
      name: "",
      foods: foods,
      date: new Date(),
      hour: "20:15",
    })
    .set("Authorization", "Bearer " + testToken);
  expect(response.statusCode).toEqual(403);
  expect(response.body.errors[0].msg).toEqual("Name cant be empty");
});

test("Deleting a meal successfully should result in a 200 status code and is not present in the DB", async () => {
  const testToken = await login();
  const foods = await createFoods(testToken);
  const response = await request(app)
    .post("/api/meals2")
    .send({
      name: "Asado",
      foods: foods,
      date: new Date(),
      hour: "20:15",
    })
    .set("Authorization", "Bearer " + testToken);
  //console.log(response._body.data);
  const mealId = response._body.data._id;
  const mealBeforeDelete = await mealModel2.findById(mealId);
  expect(mealBeforeDelete).toBeTruthy();

  const response1 = await request(app)
    .delete("/api/meals2/" + mealId)
    .set("Authorization", "Bearer " + testToken);
  expect(response1.statusCode).toEqual(200);
  const mealAfterDelete = await mealModel2.findById(mealId);
  expect(mealAfterDelete).toBeNull();
  const responseParsed1 = JSON.parse(response1.text);
  expect(responseParsed1.message).toEqual("Meal successfully deleted");
}, 6000);

test("Updating a the name and weigth of a meal and a food should return a 200 status code and name should change and its total calories", async () => {
  const testToken = await login();
  const foods = await createFoods(testToken);
  const response = await request(app)
    .post("/api/meals2")
    .send({
      name: "Carne",
      foods: foods,
      date: new Date(),
      hour: "20:15",
    })
    .set("Authorization", "Bearer " + testToken);

  const mealId = response._body.data._id;
  const mealBeforeUpdate = await mealModel2.findById(mealId);
  expect(mealBeforeUpdate).toBeTruthy();
  expect(mealBeforeUpdate.name).toEqual("Carne");
  foods[0].weightConsumed = 0;

  const response1 = await request(app)
    .put("/api/meals2/" + mealId)
    .send({
      name: "Carne con papas",
      foods: foods,
    })
    .set("Authorization", "Bearer " + testToken);
  expect(response1.statusCode).toEqual(200);
  const mealAfterUpdate = await mealModel2.findById(mealId);
  expect(mealAfterUpdate.name).toEqual("Carne con papas");
});

test("Retrieving meals for a user on a specific date should return a 200 status code", async () => {
  const testToken = await login();
  const fechaActual = new Date();
  // Obtener el año, mes y día
  const año = fechaActual.getFullYear();
  const mes = (fechaActual.getMonth() + 1).toString().padStart(2, "0"); // Los meses son indexados desde 0
  const dia = fechaActual.getDate().toString().padStart(2, "0");
  const foods = await createFoods(testToken);
  const response = await request(app)
    .post("/api/meals2")
    .send({
      name: "Asado",
      foods: foods,
      date: fechaActual,
      hour: "20:15",
    })
    .set("Authorization", "Bearer " + testToken);
  expect(response.statusCode).toEqual(200);
  // Formatear la fecha como "YYYY-MM-DD"
  const fechaFormateada = `${año}-${mes}-${dia}`;

  const response1 = await request(app)
    .get("/api/meals2/user/date/" + fechaFormateada)
    .set("Authorization", "Bearer " + testToken);
  const mealId = response1._body.mealsToSend[0]._id;
  const meal = await mealModel2.findById(mealId);
  expect(meal).toBeTruthy();
  const recievedDate = new Date(response1._body.mealsToSend[0].date);
  expect(recievedDate.getDate()).toEqual(fechaActual.getDate());

  expect(response1.statusCode).toEqual(200);
  const response2 = await request(app)
    .get("/api/meals2/user/date/2025-08-04")
    .set("Authorization", "Bearer " + testToken);
  expect(response2._body.mealsToSend[0]).toBeUndefined();
});

test("Calories between two dates should return each day and calories", async () => {
  const testToken = await login();
  const foods = await createFoods(testToken);
  const response = await request(app)
    .post("/api/meals2")
    .send({
      name: "Asado",
      foods: foods,
      date: new Date(),
      hour: "20:15",
    })
    .set("Authorization", "Bearer " + testToken);
  const startDate = encodeURI(
    "Mon Apr 08 2024 00:00:00 GMT-0300 (hora estándar de Argentina)"
  );

  const endDate = encodeURI(
    "Wed Apr 17 2024 00:00:52 GMT-0300 (hora estándar de Argentina)"
  );

  const response1 = await request(app)
    .get("/api/meals2/user/between/" + startDate + "/" + endDate)
    .set("Authorization", "Bearer " + testToken);
  expect(response1.statusCode).toEqual(200);
  let totalCalories = 0;
  response1._body.fechasIntermedias.forEach((entry) => {
    totalCalories += entry.totalCalories;
  });
  expect(totalCalories).toEqual(220);
});

test("Calories between two dates should return total calories", async () => {
  const testToken = await login();
  const foods = await createFoods(testToken);
  const date = new Date();
  const response = await request(app)
    .post("/api/meals2")
    .send({
      name: "Asado",
      foods: foods,
      date: new Date(),
      hour: "20:15",
    })
    .set("Authorization", "Bearer " + testToken);
  const response2 = await request(app)
    .post("/api/meals2")
    .send({
      name: "Asado",
      foods: foods,
      date: date.setDate(date.getDate() + 1),
      hour: "20:15",
    })
    .set("Authorization", "Bearer " + testToken);
  //Cambiar fecha
  const startDate = encodeURI(
    "Mon Apr 08 2024 00:00:00 GMT-0300 (hora estándar de Argentina)"
  );

  const endDate = encodeURI(
    "Wed Apr 17 2024 00:00:52 GMT-0300 (hora estándar de Argentina)"
  );

  const response3 = await request(app)
    .get("/api/meals2/user/startDate/" + startDate + "/endDate/" + endDate)
    .set("Authorization", "Bearer " + testToken);
  expect(response3.statusCode).toEqual(200);
  expect(response3._body.totalCalorias).toEqual(340);
});

test("Can't edit a meal from another user", async () => {
  const testToken1 = await login();
  const testToken2 = await login2();

  const foods = await createFoods(testToken1);
  const response = await request(app)
    .post("/api/meals2")
    .send({
      name: "Asado",
      foods: foods,
      date: new Date(),
      hour: "20:15",
    })
    .set("Authorization", "Bearer " + testToken1);

  const mealId = response._body.data._id;
  const mealBeforeUpdate = await mealModel2.findById(mealId);
  expect(mealBeforeUpdate).toBeTruthy();
  expect(mealBeforeUpdate.name).toEqual("Asado");
  foods[0].weightConsumed = 0;

  const response1 = await request(app)
    .put("/api/meals2/" + mealId)
    .send({
      name: "Carne con papas",
      foods: foods,
    })
    .set("Authorization", "Bearer " + testToken2);
  expect(response1.statusCode).toEqual(404);
  expect(response1._body.message).toEqual("Meal not found or unauthorized");
});

test("Can't delete a meal from another user", async () => {
  const testToken1 = await login();
  const testToken2 = await login2();

  const foods = await createFoods(testToken1);
  const response = await request(app)
    .post("/api/meals2")
    .send({
      name: "Asado",
      foods: foods,
      date: new Date(),
      hour: "20:15",
    })
    .set("Authorization", "Bearer " + testToken1);

  const mealId = response._body.data._id;
  const response1 = await request(app)
    .delete("/api/meals2/" + mealId)
    .set("Authorization", "Bearer " + testToken2);
  expect(response1.statusCode).toEqual(403);
  const responseParsed1 = JSON.parse(response1.text);
  expect(responseParsed1.message).toEqual(
    "You don't have permission to delete this meal"
  );
});
