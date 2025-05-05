const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const connectdb = require('./db/db');
const userRoutes = require('./routes/user.route');
const captainRoutes = require('./routes/captain.route');
const mapRoutes = require('./routes/maps.route');
const rideRoutes = require('./routes/ride.route');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');

connectdb();

app.use(cors());
app.use(express.json()); //to parse the incoming requests with JSON payloads
app.use(express.urlencoded({extended: true})); //to parse the incoming requests with urlencoded payloads
app.use('/users',userRoutes)
app.use('/captain', captainRoutes);
app.use('/maps', mapRoutes);
app.use('/ride', rideRoutes);
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('Hello World');
})


module.exports = app;