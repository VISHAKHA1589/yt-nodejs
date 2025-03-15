const express = require("express");
const {route}= require('./auth-routes');
const authMiddleware= require("../middleware/auth-middleware")

const router= express.Router();

router.get('/welcome',authMiddleware, (req,res)=>{

  const {username, userId, role}= req.userInfo;

  res.json({
    message: "welcome to the homepage",
    user:{
      _id:userId,
      username,
      role
    }
  })
});

module.exports= router