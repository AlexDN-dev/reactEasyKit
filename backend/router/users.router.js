const express = require("express");
const router = express.Router();
const userController = require("../controllers/users.controllers");

//router.get('/users', userController.getAllUsers);
router.post("/", userController.createUser);
router.post("/login", userController.loginUser);
router.get("/getInformations", userController.getUserInformations);
router.post("/setupOTP", userController.setupOTP);
router.post("/confirmOTP", userController.confirmOTP);
router.post("/removeOTP", userController.removeOTP);
router.post("/needOTP", userController.needOTP);

module.exports = router;
