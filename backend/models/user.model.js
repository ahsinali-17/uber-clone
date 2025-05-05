const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userSchema = mongoose.Schema({
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
    }
})

//methods is used to apply some rule on specific documents of the model (token should be generated for one lastly added doc). 
//statics is used to apply some rule on the whole model (all passwords should be hashed).

userSchema.methods.generateAuthToken = function(){  //jwt token creation
    const token = jwt.sign({_id:this._id},process.env.JWT_SECRET,{expiresIn: '24h'}); //auto-expire in 24h as we are not saving record of blacklisted tokens in db after 24 hours....
    return token;
}

userSchema.methods.comparePassword = async function(password){ //hashed password comparison
   return await bcrypt.compare(password,this.password);
}

userSchema.statics.hashPassword = async function(password){ //password hashing
    return await bcrypt.hash(password,10);
}

const User = mongoose.model('User',userSchema);
module.exports = User;