const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const {
  weekModel,
  recipeModel,
  foodModel,
  categoryModel,
} = require("../models");
const jwt = require("jsonwebtoken");
beforeAll(async () => {
  await weekModel.deleteMany({});
  await recipeModel.deleteMany({});
  await foodModel.deleteMany({});
  await categoryModel.deleteMany({});
});
async function login(email) {
  const response = await request(app).post("/api/auth/register").send({
    // se registra
    firstName: "test",
    lastName: "user",
    email: email,
    password: "adminuser",
    sex: "male",
    age: "23",
    height: "1.80",
    weight: "70",
  });
  const response1 = await request(app).post("/api/auth/login").send({
    // se logea para obtener token
    email: email,
    password: "adminuser",
  });
  return response1._body.token;
}
async function createCategory(name, testToken) {
  const response = await request(app)
    .post("/api/category")
    .send({
      name: name,
    })
    .set("Authorization", "Bearer " + testToken);
  return response._body.data._id;
}

async function createFoods(token) {
  const category = await createCategory("Carne", token);
  const foodToSend1 = {
    name: "Lomo",
    calories: 2,
    weight: 10,
    category: category,
    carbs: 0,
    proteins: 0,
    fats: 0,
  };
  const foodToSend2 = {
    name: "Vacio",
    calories: 2,
    weight: 10,
    category: category,
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

test("A week is created with a recipe breakfast in Friday and its retrievied correctly", async () => {
  const testToken = await login("adminuser@admin.com");
  const foods = await createFoods(testToken);

  const recipeToSend = {
    name: "Nueva Receta",
    foods: foods,
    steps: [{ text: "Paso 1" }],
  };

  const response = await request(app)
    .post("/api/recipes")
    .send(recipeToSend)
    .set("Authorization", "Bearer " + testToken);
  const weekToSend = {
    Friday: {
      breakfast: new mongoose.Types.ObjectId(response._body.data._id),
      lunch: null,
      snack: null,
      dinner: null,
    },
    Monday: {
      breakfast: null,
      lunch: null,
      snack: null,
      dinner: null,
    },
    Saturday: {
      breakfast: null,
      lunch: null,
      snack: null,
      dinner: null,
    },
    Sunday: {
      breakfast: null,
      lunch: null,
      snack: null,
      dinner: null,
    },
    Thursday: {
      breakfast: null,
      lunch: null,
      snack: null,
      dinner: null,
    },
    Tuesday: {
      breakfast: null,
      lunch: null,
      snack: null,
      dinner: null,
    },
    Wednesday: {
      breakfast: null,
      lunch: null,
      snack: null,
      dinner: null,
    },
  };

  const response1 = await request(app)
    .put("/api/weeks")
    .send(weekToSend)
    .set("Authorization", "Bearer " + testToken);
  expect(response1.status).toBe(200);

  const weekId = response1._body.data._id;

  const response2 = await request(app)
    .get("/api/weeks/")
    .set("Authorization", "Bearer " + testToken);

  expect(response2.status).toBe(200);
  expect(response2._body[0].Friday.breakfast.name).toEqual(recipeToSend.name);
  expect(response2._body[0].Friday.breakfast.foods).toHaveLength(2);
  expect(response2._body[0].Friday.breakfast.foods[0].foodId).toEqual(
    recipeToSend.foods[0].foodId
  );
  expect(response2._body[0].Friday.breakfast.foods[0].weightConsumed).toEqual(
    recipeToSend.foods[0].weightConsumed
  );
  expect(response2._body[0].Friday.breakfast.foods[1].foodId).toEqual(
    recipeToSend.foods[1].foodId
  );
  expect(response2._body[0].Friday.breakfast.foods[1].weightConsumed).toEqual(
    recipeToSend.foods[1].weightConsumed
  );
  expect(response2._body[0].Friday.breakfast.steps[0].text).toEqual(
    recipeToSend.steps[0].text
  );
});
test("A week is correctly created with no information", async () => {
  const testToken = await login("adminuser2@admin.com");

  const weekData = {
    Friday: {
      breakfast: null,
      lunch: null,
      snack: null,
      dinner: null,
    },
    Monday: {
      breakfast: null,
      lunch: null,
      snack: null,
      dinner: null,
    },
    Saturday: {
      breakfast: null,
      lunch: null,
      snack: null,
      dinner: null,
    },
    Sunday: {
      breakfast: null,
      lunch: null,
      snack: null,
      dinner: null,
    },
    Thursday: {
      breakfast: null,
      lunch: null,
      snack: null,
      dinner: null,
    },
    Tuesday: {
      breakfast: null,
      lunch: null,
      snack: null,
      dinner: null,
    },
    Wednesday: {
      breakfast: null,
      lunch: null,
      snack: null,
      dinner: null,
    },
  };

  const createWeekResponse = await request(app)
    .put("/api/weeks")
    .send(weekData)
    .set("Authorization", "Bearer " + testToken);
  expect(createWeekResponse.status).toBe(200);

  const getWeekResponse = await request(app)
    .get(`/api/weeks/`)
    .set("Authorization", "Bearer " + testToken);
  expect(getWeekResponse.status).toBe(200);

  expect(getWeekResponse._body[0].Friday.breakfast).toBeNull();
  expect(getWeekResponse._body[0].Friday.lunch).toBeNull();
  expect(getWeekResponse._body[0].Friday.snack).toBeNull();
  expect(getWeekResponse._body[0].Friday.dinner).toBeNull();
});
test("Week creation fails with invalid information", async () => {
  const testToken = await login("adminuser2@admin.com");

  const invalidWeekData = {
    Friday: {
      breakfast: null,
      lunch: "",
      snack: null,
      dinner: null,
    },
    Monday: {
      breakfast: null,
      lunch: null,
      snack: null,
      dinner: null,
    },
    Saturday: {
      breakfast: null,
      lunch: null,
      snack: null,
      dinner: null,
    },
    Sunday: {
      breakfast: null,
      lunch: null,
      snack: null,
      dinner: null,
    },
    Thursday: {
      breakfast: null,
      lunch: null,
      snack: null,
      dinner: null,
    },
    Tuesday: {
      breakfast: null,
      lunch: null,
      snack: null,
      dinner: null,
    },
    Wednesday: {
      breakfast: null,
      lunch: null,
      snack: null,
      dinner: null,
    },
  };

  const createWeekResponse = await request(app)
    .put("/api/weeks")
    .send(invalidWeekData)
    .set("Authorization", "Bearer " + testToken);
  expect(createWeekResponse.status).toBe(500);
});
