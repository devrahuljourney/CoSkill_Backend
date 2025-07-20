const express = require('express');
const { auth, isAdmin } = require('../middlewares/auth');
const { createSkill, assignSkill, allSkill } = require('../controllers/Skill');
const router = express.Router();
router.post("/create-skill", auth, isAdmin, createSkill);
router.post("/assign-skill/:userId", assignSkill);
router.get("/get-all-skill",allSkill)
module.exports = router;