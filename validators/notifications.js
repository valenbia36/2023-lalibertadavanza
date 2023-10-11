const { check } = require("express-validator");
const validateResults = require("../utils/handleValidator")

const validatorSendEmail = [
    check("email")
    .exists()
    .notEmpty(),
    (req, res, next) => {
        return validateResults(req, res, next);
    }
];

    
module.exports = {validatorSendEmail};