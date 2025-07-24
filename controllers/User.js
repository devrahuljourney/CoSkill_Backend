const User = require("../models/user");

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
