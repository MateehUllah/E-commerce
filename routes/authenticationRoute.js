const express=require("express")
const User=require("./../models/userModel")
const jwt = require('jsonwebtoken');

const router=express.Router()

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  };
  
const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const cookieOptions = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ), 
      httpOnly: true, 
    };
    res.cookie('jwt', token, cookieOptions);
    user.password = undefined;
  
    res.status(statusCode).json({
      status: 'success',
      token,
      data: {
        user,
      },
    });
  };

router.post("/register",async(req,res)=>{
    try{
        const newUser=await User.create({
            username:req.body.username,
            email:req.body.email,
            password:req.body.password,
        })
        res.status(201).json({
            status: 'success',
            data: {
              user:newUser,
            },
          });
    }catch(err){
        res.status(500).json(err)
        console.log(err)

    }
})
// exports.logout = (req, res) => {
//     res.cookie('jwt', 'Logout', {
//       expires: new Date(Date.now() + 10 * 1000),
//       httpOnly: true,
//     });
//     res.status(200).json({ status: 'success' });
//   };
  

router.post("/login",async(req,res)=>{
    try{
        const newUser=await User.findOne({
            username:req.body.username
        }).select("+password")
        if(!newUser||!await newUser.correctPassword(req.body.password,newUser.password)){
            res.status(401).json("Incorrect Credentials")
        }
        createSendToken(newUser,201,res);
    }catch(err){
        res.status(500).json(err)
        console.log(err)

    }
})


module.exports=router;