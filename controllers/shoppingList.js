const { shoppingListModel } = require("../models");
const { eventNames } = require("../models/users");
const { handleHttpError } = require("../utils/handleErrors");

const createShoppingList = async (req, res) => {
  try {
    const user = req.userId;
    const shoppingList = new shoppingListModel({
      user,
      weeklyTotal: req.body.weeklyTotal,
    });
    await shoppingList.save();
    res.status(200).json(shoppingList);

    res.send({ data });
  } catch (e) {
    handleHttpError(res, "ERROR_CREATE_RECIPE", 500);
  }
};
const getShoppingList = async (req, res) => {
  try {
    // Obtén el userId del request (puede que necesites ajustar cómo obtienes el userId)
    const user = req.userId;

    // Encuentra la lista de compras para el usuario específico
    const shoppingList = await shoppingListModel
      .findOne({ user })
      .populate({
        path: "weeklyTotal",
        populate: "foodId",
      })
      .exec();

    console.log(shoppingList);
    if (!shoppingList) {
      return res.status(404).json({ message: "Shopping list not found" });
    }

    // Envía la respuesta con la lista de compras poblada
    res.send({ shoppingList });
  } catch (e) {
    handleHttpError(res, "ERROR_GET_SHOPPING_LIST", 500);
  }
};

module.exports = { createShoppingList, getShoppingList };
