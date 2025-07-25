const express = require("express");
const { auth } = require("../middlewares/auth");
const { nearByPeopleByLocation, bestMatchForYou } = require("../controllers/User");
const router = express.Router();
router.get("/get-near-user",auth,nearByPeopleByLocation);
router.get("/best-match", auth, bestMatchForYou)
module.exports = router;