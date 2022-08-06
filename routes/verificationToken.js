const express=require("express")
const jwt=require("jsonwebtoken")
const {promisify}=require("util")
const User=require('./../models/userModel')
const isLoggedIn = async (req, res, next) => {
     //1) Getting token and check of it exist
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } 
  if (!token) {
    return next();
  }
  //2) Validate the token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  //decoded will have payload which have id of user etc
  //3) check if user still exists or not
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next();
  }
  req.user = Object.assign(currentUser);

  next();
  };
const verifyTokenAndAuthorization=(req,res,next)=>{
    isLoggedIn(req,res,()=>{
        if(req.user.isAdmin||req.user.id===req.params.id){
            next()
        }
        else
        {
            res.status(403).json("You are not allowed to do that")
        }
    })
}
const verifyTokenAndAdmin=(req,res,next)=>{
    isLoggedIn(req,res,()=>{
        if(req.user.isAdmin){
            next()
        }else{
            res.status(403).json("You are not allowed to do that")
        }
    })
}
module.exports={isLoggedIn,verifyTokenAndAdmin,verifyTokenAndAuthorization}