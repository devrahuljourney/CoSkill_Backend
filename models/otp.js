const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const generateOtpEmailTemplate = require("../mail/template/otpSend");

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String, 
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 5 * 60, 
  },
});

otpSchema.pre("save", async function (next) {
  try {
    await mailSender(
      this.email,
      "OTP sent successfully",
      generateOtpEmailTemplate(this.email, this.otp)
    );
    next();
  } catch (error) {
    console.error("Error sending OTP email:", error);
    next(error);
  }
});

module.exports = mongoose.model("OTP", otpSchema);
