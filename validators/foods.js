const { check } = require("express-validator");
const validateResults = require("../utils/handleValidator")

const validatorCreateFood = [
    check("name")
    .exists()
    .notEmpty(),
    check('calories')
    .exists()
    .notEmpty(),
    check('weight')
    .exists()
    .notEmpty(),
    check('category')
    .exists()
    .notEmpty(),
    (req, res, next) => {
        if (req.body.carbs === "") {
            req.body.carbs = 0;
        }
        if (req.body.proteins === "") {
            req.body.proteins = 0;
          }
        if (req.body.fats === "") {
            req.body.fats = 0;
        }
        return validateResults(req, res, next);
    }
];

    
module.exports = {validatorCreateFood};