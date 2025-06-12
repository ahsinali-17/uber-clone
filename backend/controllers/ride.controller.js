const Ride = require('../models/ride.model.js')
const {getDisTime, getAddCoordinates, getCaptainInRange} = require('../services/maps.services.js')
const {validationResult} = require("express-validator")
const {sendMsgToSocketId} = require('../socket.js')
const crypto = require('crypto'); //to create random otps

const calculatePrice = async (address1, address2) => {
   if(!address1 || !address2){
     throw new Error("pickup and ddestination are required.")
   }

   const distanceTime = await getDisTime(address1, address2)
   if(distanceTime.error){
     throw new Error(distanceTime.error)
   }
const { distance, duration } = distanceTime;
// console.log(distance, Number.parseInt(distance))
const baseRate = {
    bike: 20,
    auto: 30,
    car: 50
}

const rates = {
  bike: 5, // per km
  auto: 10, // per km
  car: 15 // per km
};

const fare = {
  bike: parseFloat(distance) * rates.bike + baseRate.bike,
  auto: parseFloat(distance) * rates.auto + baseRate.auto,
  car: parseFloat(distance) * rates.car + baseRate.car,
  distance: distance,
  time: duration,
};

return fare;
}

const createOTP = async (num) => {
  const otp = crypto.randomInt(0, Math.pow(10, num)).toString().padStart(num, '0');
  return otp;
}

const createRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {pickup, destination, vehicleType } = req.body;

    try {
        const fare = await calculatePrice(pickup, destination);
        const ride = new Ride({
        pickup,
        destination,
        user: req.user._id,
        fare: fare[vehicleType],
        distance: fare.distance,
        otp: await createOTP(6),
        });
        await ride.save();

        res.status(201).json({ message: 'Ride created successfully', ride });
          
        ride.otp = "";

        rideUser = JSON.parse(JSON.stringify( await Ride.findOne({ _id: ride._id }).populate("user")))
         const pickupCoordinates = await getAddCoordinates(pickup);
         const captainsInRange = await getCaptainInRange(pickupCoordinates.ltd, pickupCoordinates.lng, 20); // 20km radius
        if (captainsInRange.length > 0) {
          captainsInRange.map((captain) => {
            sendMsgToSocketId({event:"new-ride", data:{...rideUser}}, captain.socketId);
          })
        }
        
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.error("Error creating ride:", error);
    }
}

const getFare = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
  }

  const {pickup, destination } = req.query;

  const fare = await calculatePrice(pickup, destination);
  if(fare.error){
    return res.status(404).json({ error: fare.error });
  }
  res.status(200).json({ fare });
}

const acceptRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("errors in req")
      return res.status(400).json({ errors: errors.array()});
  }

  const {captainId,rideId} = req.body;
  try {
    const ride = await Ride.findOneAndUpdate({_id: rideId}, {captain: captainId, status: "accepted"});

    if (!ride) {
      return res.status(404).json({ error: "Ride not found" });
    }

    const rideUser = JSON.parse(JSON.stringify(await Ride.findOne({ _id: ride._id }).populate("user").populate("captain").select("+otp")));
    res.status(200).json({message: "Ride accepted successfully", rideUser});

    sendMsgToSocketId({event:"ride-accepted", data:{...rideUser}}, rideUser.user.socketId);
    console.log("msg sent to user")
  } catch (error) {
    return res.status(500).json({error: error.message});
  }
}

const startRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("errors in req")
      return res.status(400).json({ errors: errors.array()});
  }

  const {rideId, otp} = req.query;
  const captain = req.captain
  try {
    const ride = await Ride.findOne({_id: rideId}).select("+otp").populate("captain").populate("user");
    if (!ride) {
      return res.status(404).json({ error: "Ride not found" });
    }
    if (ride.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }
    if(captain.fullname.firstname !== ride.captain.fullname.firstname){
      return res.status(400).json({ error: "You are not authorized to start this ride" });
    }
    ride.status = "ongoing";
    await ride.save();
    res.status(200).json({message: "Ride started successfully", ride});

    sendMsgToSocketId({event:"ride-started", data:{msg:"ride started...", ride: ride}}, ride.user.socketId);
  } catch (error) {
    console.log(error)
    return res.status(500).json({error: error.message});
  }
}
 
const endRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array()});
  }

  const {rideId} = req.body;
  const captain = req.captain;
  try {
    const ride = await Ride.findOne({_id: rideId}).populate("captain").populate("user");
    if(!ride){
      return res.status(404).json({error: "Ride not found"});
    }
    if(captain.fullname.firstname !== ride.captain.fullname.firstname){
      return res.status(400).json({ error: "You are not authorized to end this ride" });
    }
    if(ride.status !== "ongoing"){
      return res.status(400).json({error: "Ride is not ongoing"});
    }
    await Ride.findOneAndUpdate({_id: rideId}, {status: "completed"});
    res.status(200).json({message: "Ride completed successfully"});
    sendMsgToSocketId({event:"ride-completed", data:{msg:"ride completed...", ride: ride}}, ride.user.socketId);
    console.log("msg sent to user")
  } catch (error) {
    return res.status(500).json({error: error.message});

}
}
module.exports = {createRide, getFare, acceptRide, startRide, endRide}