const mongoose = require('mongoose');

const connectDB = () => {
        mongoose.connect(process.env.MONGOOSE_URI).then(() => {
            console.log('Database connected');
        }).catch(err=>{
        console.error(err);
    })
}

module.exports = connectDB;