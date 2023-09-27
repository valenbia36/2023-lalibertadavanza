const { check } = require("express-validator");
const validateResults = require("../utils/handleValidator")

const validatorCreateMeal = [
    check("name")
    .exists()
    .notEmpty(),
    check('foods')
    .exists()
    .notEmpty(),
    (req, res, next) => {
        return validateResults(req, res, next);
    }
];

    
module.exports = {validatorCreateMeal};