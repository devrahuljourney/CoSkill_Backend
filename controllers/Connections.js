const User = require("../models/user");


exports.acceptConnection = async (req, res) => {
    try {
      const userId = req.user._id;
      const requesterId = req.params.userId;
  
      if (!userId || !requesterId) {
        return res.status(400).json({
          success: false,
          message: "UserId not found"
        });
      }
  
      const user = await User.findById(userId);
      const requester = await User.findById(requesterId);
  
      if (!user || !requester) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }
  
      if (!user.requestConnection.includes(requesterId)) {
        return res.status(400).json({
          success: false,
          message: "No pending request from this user"
        });
      }
  
      // Remove from pending requests
      user.requestConnection = user.requestConnection.filter(
        id => id.toString() !== requesterId
      );
      requester.requestSent = requester.requestSent.filter(
        id => id.toString() !== userId
      );
  
      // Add to accepted connections
      user.acceptConnection.push(requesterId);
      requester.acceptConnection.push(userId);
  
      await user.save();
      await requester.save();
  
      return res.status(200).json({
        success: true,
        message: "Connection accepted"
      });
  
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message
      });
    }
  };
  
  exports.requestSend = async (req, res) => {
    try {
      const userId = req.user._id;
      const requestedUserId = req.params.userId;
  
      if (!userId || !requestedUserId) {
        return res.status(400).json({
          message: "UserId not found",
          success: false
        });
      }
  
      if (userId.toString() === requestedUserId.toString()) {
        return res.status(400).json({
          success: false,
          message: "Cannot send request to yourself"
        });
      }
  
      const user = await User.findById(userId);
      const requestedUser = await User.findById(requestedUserId);

      console.log(user);
      console.log(requestedUser)
  
      if (!user || !requestedUser) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }
  
      if (user.requestSent.includes(requestedUserId)) {
        return res.status(400).json({
          success: false,
          message: "Connection request already sent"
        });
      }
  
      user.requestSent.push(requestedUserId);
      requestedUser.requestConnection.push(userId);
  
      await user.save();
      await requestedUser.save();
  
      return res.status(200).json({
        success: true,
        message: "Connection request sent"
      });
  
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message
      });
    }
  };
  

  exports.requestRemove = async (req, res) => {
    try {
      const userId = req.user._id;
      const requestedUserId = req.params.userId;
  
      if (!userId || !requestedUserId) {
        return res.status(400).json({
          success: false,
          message: "UserId not found"
        });
      }
  
      const user = await User.findById(userId);
      const requestedUser = await User.findById(requestedUserId);
  
      if (!user || !requestedUser) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }
  
      user.requestSent = user.requestSent.filter(
        id => id.toString() !== requestedUserId.toString()
      );
      requestedUser.requestConnection = requestedUser.requestConnection.filter(
        id => id.toString() !== userId.toString()
      );
  
      await user.save();
      await requestedUser.save();
  
      return res.status(200).json({
        success: true,
        message: "Connection request removed"
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message
      });
    }
  };
  


exports.getAllRequests = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID missing from token",
      });
    }

    const user = await User.findById(userId)
      .populate('requestSent', 'firstName lastName profilePic email') // sent users
      .populate('requestConnection', 'firstName lastName profilePic email'); // received users

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      sentRequests: user.requestSent,
      receivedRequests: user.requestConnection,
    });
  } catch (error) {
    console.error("GET REQUESTS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
