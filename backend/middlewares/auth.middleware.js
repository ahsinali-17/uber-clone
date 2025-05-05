const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const BlacklistToken = require('../models/blacklistToken.model');
const Captain = require('../models/captain.model');

const authUser = async (req,res,next)=>{
   const token = req?.cookies?.token || req.headers.authorization?.split(" ")[1];

   if(!token)
    return res.status(401).json({msg: 'No token, authorization denied'})

   const isExpired = await BlacklistToken.findOne({token});

   if(isExpired)
    return res.status(401).json({msg: 'Token is expired, authorization denied'})
 
   try{
     const decodedToken = jwt.verify(token,process.env.JWT_SECRET);
     const user = await User.findById(decodedToken._id);
     req.user = user;
     next();
   }catch(err){
     res.json({msg: 'Token is not valid'})
   }
}

const authCaptain = async (req,res,next)=>{
  const token = req?.cookies?.token || req.headers.authorization?.split(" ")[1];

  if(!token)
   return res.status(401).json({msg: 'No token, authorization denied'})

  const isExpired = await BlacklistToken.findOne({token});

  if(isExpired)
   return res.status(401).json({msg: 'Token is expired, authorization denied'})

  try{
    const decodedToken = jwt.verify(token,process.env.JWT_SECRET);
    const captain = await Captain.findById(decodedToken._id);
    res.status(200).json({captain})
    next();
  }catch(err){
    res.json({msg: 'Token is not valid'})
  }
}

module.exports = {authUser,authCaptain};