const { shoppingListModel } = require("../models");
const { eventNames } = require("../models/users");
const { handleHttpError } = require("../utils/handleErrors");

const createShoppingList = async (req, res) => {
  try {
    const user = req.userId;
    //const recipe = { ...req.body, creator };
    const shoppingList = { re };
    const data = await shoppingListModel.create(recipe);

    res.send({ data });
  } catch (e) {
    handleHttpError(res, "ERROR_CREATE_RECIPE", 500);
  }
};

module.exports = { createShoppingList };
