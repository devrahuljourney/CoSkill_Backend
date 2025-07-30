const express = require("express");
const { auth } = require("../middlewares/auth");
const { getAvailableUser } = require("../controllers/PersonalMeeting");
const router = express.Router();
router.get("/get-available-user", auth, getAvailableUser);
module.exports = router;