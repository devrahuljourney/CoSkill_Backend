const redisClient = require("../utils/redisClient")

exports.cachingBestMatch = async(req,res,next) => {
    try {

        const userId = req.user._id
        const get = await redisClient.get(`best-match:${userId}`);


        if(get) {
            console.log('✅ Match from cache');
            return res.json(JSON.parse(get));
        }
        next();
    } catch (error) {
        console.log("Error : Best matching cache",error)
    }
}


exports.cachingSearchMatch = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const searchSkill = req.query.search?.toLowerCase()?.trim();

    if (!searchSkill) return next(); 

    const cached = await redisClient.get(`search-match:${userId}:${searchSkill}`);

    if (cached) {
      console.log('✅ Search match from cache');
      return res.json({ success: true, data: JSON.parse(cached) });
    }

    next();
  } catch (error) {
    console.log("❌ Error: Search match cache", error);
    next(); 
  }
};
