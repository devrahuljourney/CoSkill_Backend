const { json } = require("express");
const User = require("../models/user");
const redisClient = require("../utils/redisClient");

exports.nearByPeopleByLocation = async (req, res) => {
    try {
        const userId = req.user._id;

        const existingUser = await User.findById(userId);
        if (!existingUser) {
            return res.status(400).json({
                message: "User not found",
                success: false
            });
        }

        const userByLocation = await User.find({
            city: existingUser.city,
            state: existingUser.state,
            _id: { $ne: userId }
        }).populate(["offeredSkills", "exploreSkills"]);

        let normalUser = [];

        if (userByLocation.length <= 5) {
            normalUser = await User.find({ _id: { $ne: userId } })
                .limit(5)
                .populate(["offeredSkills", "exploreSkills"]);
        }

        const combinedUsers = [...userByLocation, ...normalUser];

        const shuffledUsers = combinedUsers.sort(() => 0.5 - Math.random());

        return res.status(200).json({
            success: true,
            message: "Users found successfully",
            users: shuffledUsers,
            userByLocation,
            normalUser
        });
    } catch (error) {
        console.error("Error fetching nearby users:", error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

exports.bestMatchForYou = async (req, res) => {
    try {
      const userId = req.user._id;
  
      const currentUser = await User.findById(userId)
        .populate("exploreSkills")
        .populate("offeredSkills");
  
      const allUsers = await User.find({ _id: { $ne: userId } })
        .populate("exploreSkills")
        .populate("offeredSkills");
  
      const matchedUsers = [];
  
      for (const user of allUsers) {
        const matchedToMe = user.offeredSkills.filter(skill =>
          currentUser.exploreSkills.some(s => s._id.equals(skill._id))
        );
  
        const matchedFromMe = currentUser.offeredSkills.filter(skill =>
          user.exploreSkills.some(s => s._id.equals(skill._id))
        );
  
        if (matchedToMe.length > 0 || matchedFromMe.length > 0) {
          const totalRelevantSkills = currentUser.exploreSkills.length + user.exploreSkills.length;
          const matchPercentage = Math.round(
            ((matchedToMe.length + matchedFromMe.length) / totalRelevantSkills) * 100
          );
  
          matchedUsers.push({
            _id: user._id,
            firstName: user.firstName,
            profilePic: user.profilePic,
            matchPercentage,
            matchedToMe: matchedToMe.map(skill => skill.name),
            matchedFromMe: matchedFromMe.map(skill => skill.name),
          });
        }
      }
  
      matchedUsers.sort((a, b) => b.matchPercentage - a.matchPercentage);
      await redisClient.set(`best-match:${userId}`, JSON.stringify(matchedUsers), 'EX' , 1800)
  
      res.status(200).json({ success: true, data: matchedUsers });
    } catch (error) {
      console.error("Best Match Error:", error);
      res.status(500).json({ success: false, message: "Something went wrong." });
    }
  };
  
  exports.searchBestMatch = async (req, res) => {
    try {
      const userId = req.user._id;
      const searchQuery = req.query.search?.toLowerCase().trim();
  
      if (!searchQuery) {
        return res.status(400).json({ success: false, message: "Search query required." });
      }
  
      const currentUser = await User.findById(userId)
        .populate("exploreSkills")
        .populate("offeredSkills");
  
      const allUsers = await User.find({ _id: { $ne: userId } })
        .populate("exploreSkills")
        .populate("offeredSkills");
  
      const matchedUsers = [];
  
      for (const user of allUsers) {
        const nameMatch = user.firstName.toLowerCase().includes(searchQuery);
  
        const offeredSkillMatches = user.offeredSkills.filter(skill =>
          skill.name.toLowerCase().includes(searchQuery)
        );
  
        const isRelevant = nameMatch || offeredSkillMatches.length > 0;
  
        if (!isRelevant) continue;
  
        const matchedToMe = user.offeredSkills.filter(skill =>
          currentUser.exploreSkills.some(s => s._id.equals(skill._id))
        );
  
        const matchedFromMe = currentUser.offeredSkills.filter(skill =>
          user.exploreSkills.some(s => s._id.equals(skill._id))
        );
  
        const totalRelevantSkills = currentUser.exploreSkills.length + user.exploreSkills.length;
  
        const matchPercentage =
          totalRelevantSkills > 0
            ? Math.round(((matchedToMe.length + matchedFromMe.length) / totalRelevantSkills) * 100)
            : 0;
  
        matchedUsers.push({
          _id: user._id,
          firstName: user.firstName,
          profilePic: user.profilePic,
          matchPercentage,
          matchedToMe: matchedToMe.map(skill => skill.name),
          matchedFromMe: matchedFromMe.map(skill => skill.name),
          offeredMatchedSkills: offeredSkillMatches.map(skill => skill.name)
        });
      }
  
      matchedUsers.sort((a, b) => b.matchPercentage - a.matchPercentage);
  
      await redisClient.set(
        `search-match:${userId}:${searchQuery}`,
        JSON.stringify(matchedUsers),
        "EX",
        1800
      );
  
      res.status(200).json({ success: true, data: matchedUsers });
    } catch (error) {
      console.error("Search Match Error:", error);
      res.status(500).json({ success: false, message: "Something went wrong." });
    }
  };
  