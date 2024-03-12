const request = require("supertest");
const app = require("../app");
const { weekModel } = require("../models");
const jwt = require("jsonwebtoken");
beforeAll(async () => {
  await weekModel.deleteMany({});
});
function generateTestToken() {
  const genericUserData = {
    userId: "genericUserId",
    firstName: "test",
    lastName: "user",
    email: "testuser@example.com",
    sex: "male",
    age: 25,
    height: 1.75,
    weight: 68,
  };

  const secretKey = "llave_secreta";
  const options = { expiresIn: "1h" };

  return jwt.sign(genericUserData, secretKey, options);
}

test("No se creo la week correctamente por data incorrecta", async () => {
  const testToken = generateTestToken();
  const response = await request(app)
    .put("/api/weeks")
    .send({})
    .set("Authorization", "Bearer " + testToken);
  expect(response.status).toBe(400);
});

test("Se creo la week correctamente", async () => {
  const response = await request(app)
    .put("/api/weeks")
    .send({
      userId: "65b96e1981dd456178731ac5",
    })
    .set("Authorization", "Bearer " + testToken);
  expect(response.status).toBe(200);
});
test("Se creo la week correctamente con informacion de un dia vacio", async () => {
  const testToken = generateTestToken();
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
    })
    .set("Authorization", "Bearer " + testToken);
  expect(response.status).toBe(200);
});
test("No se creo la week correctamente porque recibe informacion invalida", async () => {
  const testToken = generateTestToken();
  const response = await request(app)
    .put("/api/weeks")
    .send({
      userId: "65b96e1981dd456178731ac5",
      Friday: {
        breakfast: null,
        lunch: "",
        snack: null,
        dinner: null,
      },
    })
    .set("Authorization", "Bearer " + testToken);
  expect(response.status).toBe(500);
});

test("Error Handling de get", async () => {
  const testToken = generateTestToken();
  const response = await request(app)
    .put("/api/weeks")
    .send({
      userId: "65b96e1981dd456178731ac5",
      Monday: {
        breakfast: null,
      },
    })
    .set("Authorization", "Bearer " + testToken);
  expect(response.status).toBe(200);
  const response1 = await request(app)
    .get("/api/weeks/123")
    .set("Authorization", "Bearer " + testToken);
  expect(response1.statusCode).toEqual(500);
});

test("Un usuario crea una week y se trae correctamente", async () => {
  const testToken = generateTestToken();
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
    })
    .set("Authorization", "Bearer " + testToken);
  const responseParsed = JSON.parse(response.text);
  const weekId = responseParsed.data._id;
  const response1 = await request(app)
    .get("/api/weeks/" + weekId)
    .set("Authorization", "Bearer " + testToken);
  expect(response1.statusCode).toEqual(200);
});

test("Un usuario crea una week con informacion y se trae correctamente", async () => {
  const testToken = generateTestToken();
  const createRecipeResponse = await request(app)
    .post("/api/recipes")
    .send({
      name: "Nueva Receta",
      foods: [
        {
          name: "Lomo",
          calories: 500,
          weight: 500,
          category: "Carnes Rojas",
          carbs: 100,
          proteins: 300,
          fats: 0,
          weightConsumed: 11,
          totalCalories: 11,
          totalCarbs: 2,
          totalProteins: 7,
          totalFats: 0,
        },
      ],
      steps: [{ text: "Paso 1" }],
      userId: "65aeb07036d8ac71f781636b",
    })
    .set("Authorization", "Bearer " + testToken);
  const createdRecipe = JSON.parse(createRecipeResponse.text);
  const recipeId = createdRecipe.data._id;

  const response = await request(app)
    .put("/api/weeks")
    .send({
      userId: "65b96e1981dd456178731ac5",
      Friday: {
        breakfast: recipeId, // Use the recipeId obtained from the createRecipeResponse
      },
    })
    .set("Authorization", "Bearer " + testToken);

  expect(response.statusCode).toEqual(200);

  // Retrieve the created week using GET request
  const getResponse = await request(app)
    .get("/api/weeks/65b96e1981dd456178731ac5")
    .set("Authorization", "Bearer " + testToken);

  expect(getResponse.statusCode).toEqual(200);
  const getResponseParsed = JSON.parse(getResponse.text);

  expect(getResponseParsed[0].userId).toEqual("65b96e1981dd456178731ac5");
  expect(getResponseParsed[0].Friday.breakfast.name).toEqual("Nueva Receta");
});
