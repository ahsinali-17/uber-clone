const User = require('../models/user.model');
const {validationResult} = require('express-validator')
const BlacklistToken = require('../models/blacklistToken.model')

const register = async (req, res)=>{
  const errors = validationResult(req) //to check if validtor find any data error
  if(!errors.isEmpty()){
    return res.status(400).json({errors: errors.array()}) //errors.array() has all the withMessage() messages
  }
  const {fullname, email, password} = req.body;

  if(!fullname.firstname || !email || !password){
    return res.status(400).json({msg: 'Please enter all fields'})
  }

  const exists = await User.findOne({email})
   if(exists){
      return res.status(400).json({msg: 'User already exists'})
   }

  const hashedPassword = await User.hashPassword(password); //statics: used on the whole model
    const newUser = new User({
        fullname,
        email,
        password: hashedPassword
    })

    const user = await newUser.save();
 
    const token = newUser.generateAuthToken(); //methods: used on specific documents

     res.status(201).json({
        msg: 'User registered successfully',
        user,
        token
    })
}

const login = async (req,res)=> {
   const errors = validationResult(req)
   if(!errors.isEmpty()){
    return res.status(400).json({errors: errors.array()})
   }

   const {email,password} = req.body;

   const user = await User.findOne({email}).select('+password'); //in schema password is set to select: false, so we have to explicitly select it.

   if(!user){
    return res.status(401).json({msg: 'Invalid credentials'})
   }

   const isMatch = await user.comparePassword(password)

   if(!isMatch){
    return res.status(401).json({msg: 'Invalid credentials'})
   }

   const token = user.generateAuthToken();

   //res.cookies('token',token)  //setting token in cookies

   res.status(200).json({msg: 'User logged in successfully',user,token})
}

const getProfile =async (req,res)=>{
   res.json({user: req.user})
}

const logout = async (req,res)=>{
   const token = req?.cookies?.token || req.headers.authorization?.split(" ")[1];
   //res.clearCookie('token'); //clearing the token from cookies
   await BlacklistToken.create({token});

   res.json({msg: 'User logged out successfully'})
}

module.exports = {register,login,getProfile,logout}