const { shoppingListModel } = require("../models");
const { eventNames } = require("../models/users");
const { handleHttpError } = require("../utils/handleErrors");

const createShoppingList = async (req, res) => {
  try {
    const user = req.userId;
    console.log(req.body)
    const shoppingList = new shoppingListModel({ user, weeklyTotal: req.body.weeklyTotal });
    await shoppingList.save();
    res.status(200).json(shoppingList);

    res.send({ data });
  } catch (e) {
    handleHttpError(res, "ERROR_CREATE_RECIPE", 500);
  }
};

module.exports = { createShoppingList };
