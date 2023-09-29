const express = require('express');
const router = express.Router();
const { validatorRegisterUser, validatorLoginUser } = require('../validators/auth');
const { registerController, loginController, getUsers, getUser, getUserByEmail, deleteUser, updateUser } = require('../controllers/auth');


router.get("/users", getUsers);
router.get("/users/:id", getUser);
router.get("/users/email/:email", getUserByEmail);
router.delete("/users/:id", deleteUser);
router.put("/users/:id", updateUser);
router.post("/register", validatorRegisterUser, registerController);
router.post("/login", validatorLoginUser, loginController);

module.exports = router;