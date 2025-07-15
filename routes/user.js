const express = require("express");
const { signup, generateOtp } = require("../controllers/Auth");
const Router = express.Router();

Router.post('/sign-up', signup);
Router.post('/otp-generate', generateOtp);
module.exports = Router;