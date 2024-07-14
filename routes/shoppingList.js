const express = require("express");
const router = express.Router();
const {
  createShoppingList,
  getShoppingList,
  updateShoppingList,
} = require("../controllers/shoppingList");
const { verifyToken } = require("../utils/handleJWT");
const extractUserIdMiddleware = require("../utils/handleUserID");

// Ruta para guardar la lista de compras
/* router.post(
  "/shopping-list",
  verifyToken,
  extractUserIdMiddleware,
  createShoppingList
); */

// Ruta para obtener la lista de compras
router.get("/", verifyToken, extractUserIdMiddleware, getShoppingList);

// Ruta para actualizar la cantidad que hay que comprar
router.put("/", verifyToken, extractUserIdMiddleware, updateShoppingList);

module.exports = router;
