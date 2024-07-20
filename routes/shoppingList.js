const express = require("express");
const router = express.Router();
const {
  getShoppingList,
  updateShoppingList,
  resetQuantitiesToBuy,
} = require("../controllers/shoppingList");
const { verifyToken } = require("../utils/handleJWT");
const extractUserIdMiddleware = require("../utils/handleUserID");

// Ruta para obtener la lista de compras
router.get("/", verifyToken, extractUserIdMiddleware, getShoppingList);

// Ruta para actualizar la cantidad que hay que comprar
router.put("/", verifyToken, extractUserIdMiddleware, updateShoppingList);

router.put(
  "/reset",
  verifyToken,
  extractUserIdMiddleware,
  resetQuantitiesToBuy
);

module.exports = router;
