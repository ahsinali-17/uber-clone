const Ride = require('../models/ride.model.js');
const { getDisTime, getAddCoordinates, getCaptainInRange } = require('../services/maps.services.js');
const { validationResult } = require("express-validator");
const { sendMsgToSocketId } = require('../socket.js');
const crypto = require('crypto');

const calculatePrice = async (address1, address2, coordinates) => {
  if (!address1 || !address2) {
    throw new Error("pickup and destination are required.");
  }

  const distanceTime = await getDisTime(address1, address2, coordinates);
  const { distance, duration } = distanceTime;

  const baseRate = {
    bike: 20,
    auto: 30,
    car: 50,
  };

  const rates = {
    bike: 5,
    auto: 10,
    car: 15,
  };

  const numericDistance = Number.parseFloat(distance);

  const fare = {
    bike: (numericDistance * rates.bike) + baseRate.bike,
    auto: (numericDistance * rates.auto) + baseRate.auto,
    car: (numericDistance * rates.car) + baseRate.car,
    distance: Number.parseInt(distance),
    time: duration,
  };

  return fare;
};

const createOTP = async (num) => {
  const otp = crypto.randomInt(0, Math.pow(10, num)).toString().padStart(num, '0');
  return otp;
};

const createRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { pickup, destination, vehicleType } = req.body;

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

    try {
      const rideUser = JSON.parse(JSON.stringify(await Ride.findOne({ _id: ride._id }).populate("user")));
      const pickupCoordinates = await getAddCoordinates(pickup);
      const captainsInRange = await getCaptainInRange(pickupCoordinates.ltd, pickupCoordinates.lng, 20);
      captainsInRange.forEach((captain) => {
        sendMsgToSocketId({ event: "new-ride", data: { ...rideUser } }, captain.socketId);
      });
    } catch (notificationError) {
      console.error("Error notifying captains about ride:", notificationError);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.error("Error creating ride:", error);
  }
};

const getFare = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { pickup, destination, pickupLat, pickupLng, destinationLat, destinationLng } = req.query;

  const coordinates = [pickupLat, pickupLng, destinationLat, destinationLng].every(
    (value) => value !== undefined && Number.isFinite(Number(value))
  )
    ? {
        startCoords: { ltd: Number(pickupLat), lng: Number(pickupLng) },
        endCoords: { ltd: Number(destinationLat), lng: Number(destinationLng) },
      }
    : undefined;

  try {
    const fare = await calculatePrice(pickup, destination, coordinates);
    res.status(200).json({ fare });
  } catch (error) {
    const status = error.message.includes("Geoapify") || error.message.includes("Location") || error.message.includes("Route") ? 404 : 500;
    res.status(status).json({ error: error.message });
  }
};

const cancelRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const ride = await Ride.findOne({
      _id: req.params.rideId,
      user: req.user._id,
      status: { $ne: "completed" },
    }).populate("captain");

    if (!ride) {
      return res.status(404).json({ error: "Ride not found or already completed" });
    }

    const socketIds = new Set();
    if (ride.captain?.socketId) {
      socketIds.add(ride.captain.socketId);
    }

    const pickupCoordinates = await getAddCoordinates(ride.pickup);
    const captainsInRange = await getCaptainInRange(
      pickupCoordinates.ltd,
      pickupCoordinates.lng,
      20
    );
    captainsInRange.forEach((captain) => {
      if (captain.socketId) {
        socketIds.add(captain.socketId);
      }
    });

    const deleteResult = await Ride.deleteOne({
      _id: ride._id,
      user: req.user._id,
      status: { $ne: "completed" },
    });

    if (deleteResult.deletedCount !== 1) {
      return res.status(409).json({ error: "Ride could not be cancelled" });
    }

    socketIds.forEach((socketId) => {
      sendMsgToSocketId(
        { event: "ride-cancelled", data: { rideId: ride._id } },
        socketId
      );
    });

    return res.status(200).json({ message: "Ride cancelled successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const acceptRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("errors in req");
    return res.status(400).json({ errors: errors.array() });
  }

  const { captainId, rideId } = req.body;
  try {
    const ride = await Ride.findOneAndUpdate({ _id: rideId }, { captain: captainId, status: "accepted" });

    if (!ride) {
      return res.status(404).json({ error: "Ride not found" });
    }

    const rideUser = JSON.parse(JSON.stringify(await Ride.findOne({ _id: ride._id }).populate("user").populate("captain").select("+otp")));
    res.status(200).json({ message: "Ride accepted successfully", rideUser });

    sendMsgToSocketId({ event: "ride-accepted", data: { ...rideUser } }, rideUser.user.socketId);
    console.log("msg sent to user");
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const startRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("errors in req");
    return res.status(400).json({ errors: errors.array() });
  }
 
  const { rideId, otp } = req.query;
  const captain = req.captain;
  try {
    const ride = await Ride.findOne({ _id: rideId }).select("+otp").populate("captain").populate("user");
    if (!ride) {
      return res.status(404).json({ error: "Ride not found" });
    }
    if (ride.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }
    if (captain.fullname.firstname !== ride.captain.fullname.firstname) {
      return res.status(400).json({ error: "You are not authorized to start this ride" });
    }
    ride.status = "ongoing";
    await ride.save();
    res.status(200).json({ message: "Ride started successfully", ride });

    sendMsgToSocketId({ event: "ride-started", data: { msg: "ride started...", ride: ride } }, ride.user.socketId);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

const endRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId } = req.body;
  const captain = req.captain;
  try {
    const ride = await Ride.findOne({ _id: rideId }).populate("captain").populate("user");
    if (!ride) {
      return res.status(404).json({ error: "Ride not found" });
    }
    if (captain.fullname.firstname !== ride.captain.fullname.firstname) {
      return res.status(400).json({ error: "You are not authorized to end this ride" });
    }
    if (ride.status !== "ongoing") {
      return res.status(400).json({ error: "Ride is not ongoing" });
    }
    await Ride.findOneAndUpdate({ _id: rideId }, { status: "completed" });
    res.status(200).json({ message: "Ride completed successfully" });
    sendMsgToSocketId({ event: "ride-completed", data: { msg: "ride completed...", ride: ride } }, ride.user.socketId);
    console.log("msg sent to user");
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { createRide, getFare, cancelRide, acceptRide, startRide, endRide };