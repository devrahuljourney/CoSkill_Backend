const express = require('express');
const { auth, isAdmin } = require('../middlewares/auth');
const { createSkill, assignSkill, allSkill, trendingskillByLocation } = require('../controllers/Skill');
const router = express.Router();
router.post("/create-skill", auth, isAdmin, createSkill);
router.post("/assign-skill/:userId", assignSkill);
router.get("/get-all-skill",allSkill);
router.get("/trending-skill-by-location/:userId", auth, trendingskillByLocation)
module.exports = router;