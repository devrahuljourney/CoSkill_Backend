const Skill = require("../models/skill");
const User = require("../models/user");

// Create new skill
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
    const { offeredSkills, exploreSkills} = req.body;
    const {userId } = req.params;

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

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        offeredSkills: findOfferedSkills.map(skill => skill._id),
        exploreSkills: findExploreSkills.map(skill => skill._id),
      },
      { new: true }
    ).populate("offeredSkills exploreSkills");

    return res.status(200).json({
      success: true,
      message: "Skills assigned to user successfully",
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
