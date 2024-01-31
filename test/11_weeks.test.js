const request = require("supertest");
const app = require("../app");
const { weekModel } = require("../models");

beforeAll(async () => {
  await weekModel.deleteMany({});
});

test("No se creo la week correctamente por data incorrecta", async () => {
  const response = await request(app).put("/api/weeks").send({
    name: "",
  });
  expect(response.status).toBe(400);
});

test("Se creo la week correctamente", async () => {
  const response = await request(app).put("/api/weeks").send({
    userId: "65b96e1981dd456178731ac5",
  });
  expect(response.status).toBe(200);
});
test("Se creo la week correctamente con un informacion de un dia vacio", async () => {
  const response = await request(app)
    .put("/api/weeks")
    .send({
      userId: "65b96e1981dd456178731ac5",
      Friday: {
        breakfast: null,
        lunch: null,
        snack: null,
        dinner: null,
      },
    });
  expect(response.status).toBe(200);
});

test("Un usuario crea una week y se trae correctamente", async () => {
  const response = await request(app)
    .put("/api/weeks")
    .send({
      userId: "65b96e1981dd456178731ac5",
      Monday: {
        breakfast: {
          name: "Lomo",
          foods: [
            {
              name: "Lomo",
              calories: 500,
              weight: 500,
              category: "Carnes Rojas",
              carbs: 100,
              proteins: 300,
              fats: 0,
              weightConsumed: 22,
              totalCalories: 22,
              totalCarbs: 4,
              totalProteins: 13,
              totalFats: 0,
            },
          ],
          steps: [
            {
              text: "Paso 1",
            },
          ],
        },
      },
    });
  expect(response.status).toBe(200);
  const responseParsed = JSON.parse(response.text);
  const weekId = responseParsed.data._id;
  const response1 = await request(app).get("/api/weeks/" + weekId);
  expect(response1.statusCode).toEqual(200);
});

test("Error Handling de get", async () => {
  const response = await request(app)
    .put("/api/weeks")
    .send({
      userId: "65b96e1981dd456178731ac5",
      Monday: {
        breakfast: {
          name: "Lomo",
          foods: [
            {
              name: "Lomo",
              calories: 500,
              weight: 500,
              category: "Carnes Rojas",
              carbs: 100,
              proteins: 300,
              fats: 0,
              weightConsumed: 22,
              totalCalories: 22,
              totalCarbs: 4,
              totalProteins: 13,
              totalFats: 0,
            },
          ],
          steps: [
            {
              text: "Paso 1",
            },
          ],
        },
      },
    });
  expect(response.status).toBe(200);
  const response1 = await request(app).get("/api/weeks/123");
  expect(response1.statusCode).toEqual(500);
});
