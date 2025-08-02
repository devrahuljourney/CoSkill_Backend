const express = require("express");
const { signup, generateOtp, login, pushExpoToken } = require("../controllers/Auth");
const { auth } = require("../middlewares/auth");
const Router = express.Router();

Router.post('/sign-up', signup);
Router.post('/otp-generate', generateOtp);
Router.post('/login', login)
Router.post("/push-expo-token",auth,pushExpoToken)
module.exports = Router;