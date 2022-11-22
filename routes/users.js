var express = require("express");
var router = express.Router();
var userController = require("../controller/user.controller");
const { authVerify } = require("../auth");

//To get all users
router.get("", authVerify, userController.getAllUsers);

//To get a user with user ID
router.get("/:id", authVerify, userController.getUserWithID);

//To create/register a user
router.post("", userController.createUser);

//To login a user
router.post("/login", userController.loginUser);

//To update the user with user ID
router.put("/:id", authVerify, userController.updateUserWithID);

//To delete the user with user ID
router.delete("/:id", authVerify, userController.deleteUserWithID);

module.exports = router;
