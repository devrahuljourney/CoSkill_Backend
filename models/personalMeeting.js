const mongoose = require('mongoose');
const { Schema } = mongoose;

const personalMeetingSchema = new Schema({
  hostUser: { type: Schema.Types.ObjectId, ref: "User", required: true },
  sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
  meetingLink: { type: String },
  date: { type: Date, required: true },
  time: { type: String, required: true }, 
  duration: { type: Number, default: 30 },
  status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
  senderMessage: { type: String },
  rejectionMessage: { type: String },
  expireAt: {
    type: Date,
    index: { expires: 0 }
  }
}, { timestamps: true });

module.exports = mongoose.model('PersonalMeeting', personalMeetingSchema);
