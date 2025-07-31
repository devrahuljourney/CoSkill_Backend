const express = require("express");
const { auth } = require("../middlewares/auth");
const { getAvailableUser, getBookSlotByDate, requestMeeting, acceptMeeting } = require("../controllers/PersonalMeeting");
const router = express.Router();
router.get("/get-available-user", auth, getAvailableUser);
router.post("/get-booked-slot",auth, getBookSlotByDate);
router.post("/request-meeting", auth, requestMeeting);
router.post("/accept-meeting",auth, acceptMeeting);
module.exports = router;