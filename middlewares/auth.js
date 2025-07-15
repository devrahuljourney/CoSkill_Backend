const jwt = require("jsonwebtoken");
require("dotenv").config();

const User = require("../models/user");


exports.auth = async (req, res,next) => {
 try {
    // extract token

    const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ","");
    console.log("token", token)
    // if token is missing return res
    if(!token) {
        return res.status(401).json({
            success:false,
            message:"Token is missing"
        })
    }

    console.log("checking token")
    console.log("req body ", req.body )
    // verifying token

    try {
        const decode =  jwt.verify(token,process.env.JWT_SECRET);
        console.log("Decoded token ", decode);
        req.user = decode;
        console.log("request user data ", req.user);
    } catch (error) {
        // verificatiin issue

        return res.status(401).json({
            success:false,
            message:"token is invalid"
        })
    }
    next();
 } catch (error) {
    return res.status(401).json({
        success:false,
        message: 'Someting went wrong while validating the token'
    })
 }
}



// is Admin

exports.isAdmin = async (req,res,next) => {
    try {

        console.log("account Type", req.user.role)
        if(req.user.role !== "admin"){
            return res.status(401).json({
                success:false,
                message: " This is protected route for Admin Only"
            })
        }
        next();
        console.log("User role verified")
    } catch (error) {
        return res.status(500).json({
            success:false,
            message: "user role cannot be verified"
        })
    }
}