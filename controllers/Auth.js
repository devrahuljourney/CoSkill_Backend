const jwt = require("jsonwebtoken");
const OTP = require("../models/otp");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const user = require("../models/user");

exports.generateOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await OTP.create({ email, otp });


    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      otp
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to generate OTP",
      error: error.message,
    });
  }
};

exports.signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password, confirmPassword, otp } = req.body;

    if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Passwords do not match." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "User already registered." });
    }

    const validOtpEntry = await OTP.findOne({ email }).sort({ createdAt: -1 });
    if (!validOtpEntry || validOtpEntry.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    const payload = {
      _id: newUser._id,
      email: newUser.email,
      role : user.role
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

    res
      .cookie("token", token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 })
      .status(200)
      .json({
        success: true,
        message: "User registered successfully",
        token,
        user: {
          _id: newUser._id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
        },
      });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error registering user",
      error: error.message,
    });
  }
};


exports.login = async (req,res) => {
  try {
    const {email,password} = req.body;
    if(!email || !password){
      return res.status(400).json({
        success: false,
        message:"All field are required"
      })
    }

    const user = await User.findOne({email});
    if(!user) {
      return res.status(400).json({
        success: false,
        message:"User not registered"
      })
    }

    console.log("Password", password, user, user?.password)

    if(await bcrypt.compare(password, user.password))
    {
      const payload = {
        email : user.email,
        _id: user._id,
        role : user.role

    }
       const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "7D"
       })
       user.token  = token;
       user.password = undefined;


const options = {
    expires: new Date(Date.now() + 7*24*60*60*1000),
    httpOnly:true

}
res.cookie("token",token, options).status(200).json({
    success:true,
    token,
    user,
    message:'logged in'
})
    }

    else {
      return res.status(400).json({
        message:"Password not matched",
        success:false
      })
    }
  } catch (error) {
    console.log("error in login", error)
        return res.status(400).json({
            success:false,
            message:"Login failure "
        })
  }
}