const express = require("express");
const router = express.Router();
const { createShoppingList } = require("../controllers/shoppingList");
const { verifyToken } = require("../utils/handleJWT");
const extractUserIdMiddleware = require("../utils/handleUserID");

// Ruta para guardar la lista de compras
router.post("/shopping-list", verifyToken, extractUserIdMiddleware);

// Ruta para obtener la lista de compras
router.get("/shopping-list");

// Ruta para actualizar la cantidad que hay que comprar
router.put("/shopping-list/update-quantity");

module.exports = router;
