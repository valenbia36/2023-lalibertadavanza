const { shoppingListModel } = require("../models");
const { eventNames } = require("../models/users");
const { handleHttpError } = require("../utils/handleErrors");

const getShoppingList = async (req, res) => {
  try {
    const user = req.userId;

    const shoppingList = await shoppingListModel
      .findOne({ user })
      .populate({
        path: "weeklyTotal",
        populate: "foodId",
      })
      .exec();

    if (!shoppingList) {
      return res.status(404).json({ message: "Shopping list not found" });
    }

    // Envía la respuesta con la lista de compras poblada
    res.send({ shoppingList });
  } catch (e) {
    handleHttpError(res, "ERROR_GET_SHOPPING_LIST", 500);
  }
};

const updateShoppingList = async (req, res) => {
  try {
    const userId = req.userId;
    const { foodId, quantityToBuy } = req.body;

    // Encuentra la lista de compras del usuario
    const shoppingList = await shoppingListModel
      .findOne({ user: userId })
      .populate({
        path: "weeklyTotal",
        populate: "foodId",
      })
      .exec();
    if (!shoppingList) {
      return res.status(404).json({ message: "Shopping list not found" });
    }
    // Encuentra el índice del elemento en weeklyTotal que coincide con foodId
    const itemIndex = shoppingList.weeklyTotal.findIndex(
      (item) => item.foodId._id.toString() === foodId.foodId._id.toString()
    );

    if (itemIndex === -1) {
      return res
        .status(404)
        .json({ message: "Food item not found in shopping list" });
    }

    const item = shoppingList.weeklyTotal[itemIndex];
    const currentQuantityToBuy = parseFloat(item.quantityToBuy) || 0;
    const newQuantityToBuy = currentQuantityToBuy + parseFloat(quantityToBuy);
    // Verifica que la nueva cantidad no exceda el weightConsumed
    if (newQuantityToBuy > item.weightConsumed) {
      return res
        .status(400)
        .json({ message: "Quantity to buy exceeds the weight consumed" });
    }

    // Actualiza la cantidad a comprar
    item.quantityToBuy = newQuantityToBuy;

    // Guarda los cambios en la base de datos
    await shoppingList.save();

    res
      .status(200)
      .json({ message: "Shopping list updated successfully", shoppingList });
  } catch (e) {
    console.error("Error updating shopping list:", e);
    handleHttpError(res, "ERROR_UPDATE_SHOPPING_LIST", 500);
  }
};

const resetQuantitiesToBuy = async (req, res) => {
  try {
    const userId = req.userId;

    // Encuentra la lista de compras del usuario
    const shoppingList = await shoppingListModel
      .findOne({ user: userId })
      .populate({
        path: "weeklyTotal",
        populate: "foodId",
      })
      .exec();

    if (!shoppingList) {
      return res.status(404).json({ message: "Shopping list not found" });
    }

    // Reinicia la cantidad a comprar de todos los elementos en weeklyTotal
    shoppingList.weeklyTotal.forEach((item) => {
      item.quantityToBuy = 0;
    });

    // Guarda los cambios en la base de datos
    await shoppingList.save();

    res.status(200).json({
      message: "Quantities to buy reset successfully",
      shoppingList,
    });
  } catch (e) {
    console.error("Error resetting quantities to buy:", e);
    handleHttpError(res, "ERROR_RESET_QUANTITIES_TO_BUY", 500);
  }
};

module.exports = { getShoppingList, updateShoppingList, resetQuantitiesToBuy };
