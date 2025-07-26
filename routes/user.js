const express = require("express");
const { auth } = require("../middlewares/auth");
const { nearByPeopleByLocation, bestMatchForYou, searchBestMatch } = require("../controllers/User");
const { cachingBestMatch, cachingSearchMatch } = require("../middlewares/cacheMiddleware");
const router = express.Router();
router.get("/get-near-user",auth,nearByPeopleByLocation);
router.get("/best-match", auth, cachingBestMatch, bestMatchForYou);
router.get("/search-match",auth, cachingSearchMatch, searchBestMatch)
module.exports = router;