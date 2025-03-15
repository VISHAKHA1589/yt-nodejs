const User = require('../models/User');
const bcrypt= require('bcryptjs');
const jwt= require('jsonwebtoken');





//register controller
const registerUser= async(req,res)=>{
  try{

    //extract user info from req body
    const {username, email, password, role }= req.body;
    //check if the user already exists in our database
//checks if username or email already exists witj $or operator in databse
    const checkExistingUser= await User.findOne({$or:[{username}, {email}]})
    if(checkExistingUser){
      return res.status(400).json({
        success:false,
        message: "user alreadye xists with same username or email, please try with a different username or email"
      });
    }

    //hash user password
    const salt= await bcrypt.genSalt(10);
    const hashedPassword= await bcrypt.hash(password, salt)

    //now create a new user and save in your database

    const newlyCreatedUser= new User({
      username,
      email,
      password: hashedPassword,
      role: role || 'user'
      
    })
    await newlyCreatedUser.save();

    if(newlyCreatedUser){
      res.status(201).json({
        success:true,
        message: "user registered successfully"
      })
    }
    else{
      res.status(400).json({
        success:false,
        message: "user registration unsuccessfull, please try again"
      })

    }

   
  }catch(e){
    console.log(e);
    res.status(500).json({
      success: false,
      message: "some error occured please try again"
    })
  }
}




const changePassword= async(req,res)=>{
  try{
    const userId= req.userInfo.userId;
    //extract old and new password
    const {oldPassword, newPassword}= req.body;
    //find the current logged in user
    const user= await User.findById(userId);
    if(!user){
      return res.status(400).json({
        success: false,
        message: 'User not found'
      })
    }
    //if the old password is correct

    const isPasswordMAtch= await bcrypt.compare(oldPassword, user.password);

    if(!isPasswordMAtch){
      return res.status(400).json({
        success: false, mesaage: "old password is not correct, please try again"
      })
    }

    //hash the new password here
    const salt= await bcrypt.genSalt(10);
    const newHashedPassword= await bcrypt.hash(newPassword, salt);

    //updare user password

    user.password= newHashedPassword;
    await user.save();

    res.status(200).json({
      success:true,
      message: "password change dsuccessfully"
    })

  }catch(error){
    console.log(error);
    res.status(500).json({
      success: false,
      message: "some error occured please try again"
    })
  }
}


//login controller

const loginUser=async(req,res)=>{
  try{

    const {username, password}= req.body;
  const user= await User.findOne({username});
  if(!user){
    return res.status(400).json({
      success:false,
      message: "invalid credentials"
    })
    
  }

  //if password is correct or not

  const isPasswordMAtch= await bcrypt.compare(password,user.password )

  if(!isPasswordMAtch){
    return res.status(400).json({
      success:false,
      message: "invalid credentials"
    })

  }

  //assign token [[bearer token]], can store in cookie, or pass it to frontend and store it in session storage

  //create user token
  //jsonwebtoken
  const accessTOken= jwt.sign({
    userId: user._id,
    username: user.username,
    role:user.role
  }, process.env.JWT_SECRET_KEY,{
    expiresIn: '15m'
  })

  res.status(200).json({
    success:true,
    message: "logged in sucessfully",
    accessTOken
  })



  }

   catch(e){
    console.log(e);
    res.status(500).json({
      success: false,
      message: "some error occured please try again"
    })
  }
}


module.exports={loginUser, registerUser, changePassword}