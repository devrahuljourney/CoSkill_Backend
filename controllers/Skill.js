const Skill = require("../models/skill");
const User = require("../models/user");


exports.createSkill = async (req, res) => {
  try {
    const { name, category } = req.body;

    if (!name || !category) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const newSkill = new Skill({ name, category });
    await newSkill.save();

    return res.status(200).json({
      success: true,
      message: "Skill created successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Skill creation failed",
      error: error.message,
    });
  }
};

exports.assignSkill = async (req, res) => {
  try {
    const { offeredSkills, exploreSkills, location } = req.body;
    const { userId } = req.params;

    if (!userId || !offeredSkills || !exploreSkills) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const findOfferedSkills = await Skill.find({ name: { $in: offeredSkills } });
    const findExploreSkills = await Skill.find({ name: { $in: exploreSkills } });

    if (!findOfferedSkills.length || !findExploreSkills.length) {
      return res.status(404).json({
        success: false,
        message: "Some skills not found",
      });
    }

    const addUserToSkills = async (skills) => {
      for (const skill of skills) {
        if (!skill.users.includes(userId)) {
          skill.users.push(userId);
          await skill.save();
        }
      }
    };

    await addUserToSkills(findOfferedSkills);
    await addUserToSkills(findExploreSkills);

    const updateData = {
      offeredSkills: findOfferedSkills.map(skill => skill._id),
      exploreSkills: findExploreSkills.map(skill => skill._id),
    };

    if (location?.city) updateData.city = location.city;
    if (location?.state) updateData.state = location.state;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).populate("offeredSkills exploreSkills");

    return res.status(200).json({
      success: true,
      message: "Skills and location assigned to user successfully",
      user: updatedUser,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Skill assignment failed",
      error: error.message,
    });
  }
};




exports.allSkill = async (req,res) => {
  try {
    const skill = await  Skill.find({});
    return res.status(200).json({
      skill,
      success: true,
      message:"Skill fetch successfully."
    })
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:"Skill not fetched",
      error: error.message
    })
  }
}



exports.trendingskillByLocation = async (req, res) => {
  try {
    const { userId } = req.params;
    const limit = parseInt(req.query.limit) || 5;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "UserId is required"
      });
    }

    const user = await User.findById(userId);
    if (!user || !user.city || !user.state) {
      return res.status(400).json({
        success: false,
        message: "User or location not found"
      });
    }

    const usersInSameLocation = await User.find({
      city: user.city,
      state: user.state
    }).populate('offeredSkills');

    const skillCount = {};

    usersInSameLocation.forEach(u => {
      u.offeredSkills.forEach(skill => {
        const id = skill._id.toString();
        if (!skillCount[id]) {
          skillCount[id] = {
            skillId: skill._id,
            name: skill.name,
            count: 1
          };
        } else {
          skillCount[id].count += 1;
        }
      });
    });

    const sortedSkills = Object.values(skillCount)
      .sort((a, b) => b.count - a.count)
      .map((s, index) => ({
        rank: index + 1,
        name: s.name,
        count: s.count,
        skillId: s.skillId
      }))
      .slice(0, limit);

      const shuffledSkills = sortedSkills.sort(() => 0.5 - Math.random());
      const topSkills = shuffledSkills.slice(0, limit);


    return res.status(200).json({
      success: true,
      skills: sortedSkills,
      topSkills,
      totalUsers: usersInSameLocation.length,
      location: {
        city: user.city,
        state: user.state
      }
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};
