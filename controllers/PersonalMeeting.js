const PersonalMeeting = require("../models/personalMeeting");
const User = require("../models/user");


exports.getAvailableUser = async (req,res) => {
    try {
        const userId = req.user._id;
        if(!userId) {
            return res.status(400).json({
                success: false,
                message:" userId not found"
            })
        }

        const user = await User.findById(userId);

        if(!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }

        const meetings = await PersonalMeeting.find({
            $and: [
              { status: "accepted" },
              { $or: [{ hostUser: userId }, { sender: userId }] }
            ]
          });
          

        const alreadyBookedUser = new Set();
        alreadyBookedUser.add(userId.toString());

        meetings.forEach((meeting) => {
            alreadyBookedUser.add(meeting.hostUser.toString())
            alreadyBookedUser.add(meeting.sender.toString())
        })


        const availableUsers = await User.find({
            _id: {
              $in: user.acceptConnection, 
              $nin: Array.from(alreadyBookedUser), 
            }
          }).select("-password");
          
        return res.status(200).json({
            users : availableUsers,
            message: "User fetched successfully",
            success: true
        })
    } catch (error) {
        return res.status(400).json({
            message: "User fetched failed",
            success: false,
            error:error.message
        })
    }
}