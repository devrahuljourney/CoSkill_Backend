const express = require("express");
const { signup, generateOtp, login } = require("../controllers/Auth");
const Router = express.Router();

Router.post('/sign-up', signup);
Router.post('/otp-generate', generateOtp);
Router.post('/login', login)
module.exports = Router;