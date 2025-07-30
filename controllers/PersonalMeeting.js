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

        const meetings = await PersonalMeeting.find({$or: [ {hostedUser : userId}, {sender: userId}]});

        const alreadyBookedUser = new Set();
        console.log("alreadybookeduser", alreadyBookedUser);
        alreadyBookedUser.add(userId.toString());

        meetings.forEach((meeting) => {
            alreadyBookedUser.add(meeting.hostUser.toString())
            alreadyBookedUser.add(meeting.sender.toString())
        })
        console.log("alreadybookeduser", alreadyBookedUser);


        const totalUser = await User.find({_id : {$nin : Array.from(alreadyBookedUser)}}).select("-password");
        return res.status(200).json({
            users : totalUser,
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