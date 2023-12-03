const express = require('express');
const router = express.Router();
const { validatorRegisterUser, validatorLoginUser } = require('../validators/auth');
const { registerController, loginController, getUsers, getNutritionistUsers, getUser, getUserByEmail, deleteUser, updateUserPassword, updateUser, updateNutritionist, getNutritionistByUserId, getPatientsByNutritionistId } = require('../controllers/auth');


router.get("/users", getUsers);
router.get("/nutritionistUsers", getNutritionistUsers);
router.get("/patientsByNutritionistId/:id", getPatientsByNutritionistId);
router.get("/nutritionistByUserId/:id", getNutritionistByUserId);
router.get("/users/:id", getUser);
router.get("/users/email/:email", getUserByEmail);
router.delete("/users/:id", deleteUser);
router.put("/users/updatePassword/:id", updateUserPassword);
router.put("/users/:id", updateUser);
router.put("/assign-nutritionist/:id", updateNutritionist);
router.post("/register", validatorRegisterUser, registerController);
router.post("/login", validatorLoginUser, loginController);

module.exports = router;