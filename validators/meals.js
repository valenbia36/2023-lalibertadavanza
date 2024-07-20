const { check } = require("express-validator");
const validateResults = require("../utils/handleValidator");

const validatorCreateMeal = [
  check("name").exists().notEmpty().withMessage("Name cant be empty"),
  check("foods").exists().notEmpty().withMessage("Foods cant be empty"),
  (req, res, next) => {
    return validateResults(req, res, next);
  },
];

module.exports = { validatorCreateMeal };
