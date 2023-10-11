const express = require('express');
const router = express.Router();
const { getCategories, createCategory} = require('../controllers/category');
const { validatorCreateCategory} = require('../validators/category');

router.get("/", getCategories);
router.post("/", validatorCreateCategory, createCategory);

module.exports = router;