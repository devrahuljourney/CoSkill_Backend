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

        const date = Date.now()

        const meetings = await PersonalMeeting.find({
            $and: [
              { status: "accepted" },
              { $or: [{ hostUser: userId }, { sender: userId }] },
              { date: { $gt: date } }
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
          }).select("-password").populate("offeredSkills exploreSkills");
          
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

exports.getBookSlotByDate = async (req, res) => {
    try {
      const { selected, userId } = req.body;
  
      if (!selected || !userId) {
        return res.status(400).json({
          success: false,
          message: "Date or userId not provided",
        });
      }
  
      const meetings = await PersonalMeeting.find({
        date: selected,
        hostUser: userId,
      });
  
      const bookedSlots = meetings.map(m => m.time);
  
      return res.status(200).json({
        success: true,
        bookedSlots,
      });
  
    } catch (error) {
      console.error("Error in getBookSlotByDate:", error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  };
  

  exports.requestMeeting = async (req, res) => {
    try {
      const { hostUser, sender, date, time, duration, senderMessage } = req.body;
  
      if (!hostUser || !sender || !date || !time) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields (hostUser, sender, date, or time)",
        });
      }
  
      const existingMeeting = await PersonalMeeting.findOne({
        hostUser,
        date,
        time : time.start,
      });
  
      if (existingMeeting) {
        return res.status(409).json({
          success: false,
          message: "This time slot is already booked",
        });
      }

      const meetingDate = new Date(date);
  
      const newMeeting = await PersonalMeeting.create({
        hostUser,
        sender,
        date,
        time: time.start,
        duration: duration || 30,
        senderMessage,
        expireAt: new Date(meetingDate.getTime() + 24 * 60 * 60 * 1000)
      });
  
      return res.status(201).json({
        success: true,
        message: "Meeting request sent",
        meeting: newMeeting,
      });
  
    } catch (error) {
      console.error("Error in requestMeeting:", error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  };

  exports.acceptMeeting = async (req, res) => {
    try {
      const { meetingId } = req.body;
  
      if (!meetingId) {
        return res.status(400).json({
          success: false,
          message: "Meeting ID is required",
        });
      }
  
      const meeting = await PersonalMeeting.findById(meetingId);
      if (!meeting) {
        return res.status(404).json({
          success: false,
          message: "Meeting not found",
        });
      }
  
      if (meeting.status === "accepted") {
        return res.status(409).json({
          success: false,
          message: "Meeting is already accepted",
        });
      }
  
      const roomId = `${meeting._id}-${Date.now()}`;
      // const jitsiLink = `https://meet.jit.si/${roomId}`;
      // const jitsiLink = `https://8x8.vc/${roomId}`;
      const jitsiLink = `https://meet.ffmuc.net/${roomId}?config.prejoinPageEnabled=false`;

  
      meeting.status = "accepted";
      meeting.meetingLink = jitsiLink;
      await meeting.save();
  
      return res.status(200).json({
        success: true,
        message: "Meeting accepted",
        meeting,
      });
  
    } catch (error) {
      console.error("Error in acceptMeeting:", error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  };
  
  exports.getMeetingsByHost = async (req, res) => {
    try {
      const { hostUserId } = req.params;
  
      if (!hostUserId) {
        return res.status(400).json({
          success: false,
          message: "hostUserId is required",
        });
      }
  
      const requestedMeetings = await PersonalMeeting.find({
        hostUser: hostUserId,
        status: "pending",
      }).populate("sender", "name email");
  
      const acceptedMeetings = await PersonalMeeting.find({
        hostUser: hostUserId,
        status: "accepted",
      }).populate("sender", "name email");
  
      return res.status(200).json({
        success: true,
        requestedMeetings,
        acceptedMeetings,
      });
  
    } catch (error) {
      console.error("Error in getMeetingsByHost:", error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  };
  

  exports.getMeetingByStatus = async (req, res) => {
    try {
      const { status } = req.body;
      const userId = req.user._id;
  
      if (!status) {
        return res.status(400).json({
          success: false,
          message: "Status not found"
        });
      }
  
      const today = new Date();
      today.setHours(0, 0, 0, 0);
  
      const meetings = await PersonalMeeting.find({
        status,
        date: { $gte: today },
        $or: [
          { hostUser: userId },
          { sender: userId }
        ]
      }).populate("hostUser").sort({ date: -1 , time: -1});
  
      return res.status(200).json({
        success: true,
        meetings
      });
  
  
    } catch (error) {
      console.error("GET MEETINGS ERROR:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  };
  

  exports.rejectMeeting = async (req, res) => {
    try {
      const { meetingId, rejectionMessage } = req.body;
  
      if (!meetingId || !rejectionMessage) {
        return res.status(400).json({
          success: false,
          message: "Meeting ID and rejection message are required",
        });
      }
  
      const meeting = await PersonalMeeting.findById(meetingId);
      if (!meeting) {
        return res.status(404).json({
          success: false,
          message: "Meeting not found",
        });
      }
  
      if (meeting.status === "rejected") {
        return res.status(409).json({
          success: false,
          message: "Meeting is already rejected",
        });
      }
  
      meeting.status = "rejected";
      meeting.rejectionMessage = rejectionMessage;
      await meeting.save();
  
      return res.status(200).json({
        success: true,
        message: "Meeting rejected",
        meeting,
      });
  
    } catch (error) {
      console.error("Error in rejectMeeting:", error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  };
  