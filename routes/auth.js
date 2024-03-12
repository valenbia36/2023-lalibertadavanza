const express = require("express");
const router = express.Router();
const {
  validatorRegisterUser,
  validatorLoginUser,
} = require("../validators/auth");
const {
  registerController,
  loginController,
  getUsers,
  getUser,
  getUserByEmail,
  deleteUser,
  updateUserPassword,
  updateUser,
} = require("../controllers/auth");
const { verifyToken } = require("../utils/handleJWT");

router.get("/users", verifyToken, getUsers);
router.get("/users/:id", verifyToken, getUser);
router.get("/users/email/:email", verifyToken, getUserByEmail);
router.delete("/users/:id", verifyToken, deleteUser);
router.put("/users/updatePassword/:id", verifyToken, updateUserPassword);
router.put("/users/:id", verifyToken, updateUser);
router.post("/register", validatorRegisterUser, registerController);
router.post("/login", validatorLoginUser, loginController);

module.exports = router;
