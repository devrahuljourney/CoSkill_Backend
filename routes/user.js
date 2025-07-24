const express = require("express");
const { auth } = require("../middlewares/auth");
const { nearByPeopleByLocation } = require("../controllers/User");
const router = express.Router();
router.get("/get-near-user",auth,nearByPeopleByLocation);
module.exports = router;