const Captain = require('../models/captain.model');
const {validationResult} = require('express-validator');
const BlacklistToken = require('../models/blacklistToken.model');


const register = async (req, res) => {
  const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    const {email, fullname, password, vehicle} = req.body;

    if(!email || !fullname.firstname || !password || !vehicle.color || !vehicle.plate || !vehicle.capacity || !vehicle.vehicleType){
        return res.status(400).json({msg: 'Please enter all fields'});
    }

    const exists = await Captain.findOne({email})
   if(exists){
      return res.status(400).json({msg: 'User already exists'})
   }

    const hashedPassword = await Captain.hashPassword(password);
     const newCaptain = new Captain({
        email,
        fullname,
        password: hashedPassword,
        vehicle
     })
        await newCaptain.save();
        const token = newCaptain.generateAuthToken();

        res.status(201).json({newCaptain,token,msg: 'Captain registered successfully'}); 
}

const login = async (req,res)=> {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
     return res.status(400).json({errors: errors.array()})
    }

    const {email,password} = req.body;

    const captain = await Captain.findOne({email}).select('+password');

    if(!captain ){
        return res.status(401).json({msg: 'Invalid credentials'});
    }

    const isMatch = await captain.comparePassword(password);

    if(!isMatch){
        return res.status(401).json({msg: 'Invalid credentials'});
    }

    const token = captain.generateAuthToken();

    res.status(200).json({captain,token,msg: 'Captain logged in successfully'});
}

const logout = async (req,res)=>{
 const token = req?.cookies?.token || req.headers.authorization?.split(" ")[1];

    await BlacklistToken.create({token});

    res.status(200).json({msg: 'Captain logged out successfully'});
}

const getProfile = async (req,res)=>{
    res.status(200).json({captain: req.captain})
}

module.exports = {register,login,logout,getProfile};