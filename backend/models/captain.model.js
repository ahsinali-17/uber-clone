const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const captainSchema = new mongoose.Schema({
    fullname:{
        firstname:{
            type:String,
            required:true,
            minLength:[3,'First name must be at least 3 characters long'],
        },
        lastname:{
            type:String,
            minLength:[3,'Last name must be at least 3 characters long'],
        }
    },
    email:{
        type:String,
        required:true,
        unique:true,
        minLength:[6,'Email must be at least 6 characters long'],
    },
    password:{
        type:String,
        required:true,
        select:false
    },
    socketId:{
        type:String,
    },
    status:{
        type:String,
        enum: ['online', 'offline'],
        default: 'offline'
    },
    vehicle:{
        color:{
            type:String,
            required:true,
            minLength:[3,'Color must be at least 3 characters long'],
        },
        plate:{
            type:String,
            required:true,
            minLength:[3,'Number must be at least 3 characters long'],
        },
        capacity:{
            type:Number,
            required:true,
            min: [1, 'Capacity must be at least 1 person' ],
        },
        vehicleType:{
            type:String,
            required:true,
            enum: ['car', 'bike', 'auto']
        }
    },
    location:{
        ltd:{
            type:Number,
        },
        lng:{
            type:Number,
        }
    }

});

captainSchema.methods.generateAuthToken = function(){  
    const token = jwt.sign({_id:this._id},process.env.JWT_SECRET,{expiresIn: '24h'}); 
    return token;
}

captainSchema.methods.comparePassword = async function(password){ 
   return await bcrypt.compare(password,this.password);
}

captainSchema.statics.hashPassword = async function(password){ 
    return await bcrypt.hash(password,10);
}

const Captain = new mongoose.model('Captain', captainSchema);

module.exports = Captain;