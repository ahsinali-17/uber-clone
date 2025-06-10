const express = require("express");
const router = express.Router();
const rideController = require("../controllers/ride.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const { body, query } = require("express-validator");

router.post(
  "/create", authMiddleware.authUser,
  body("pickup")
    .isString()
    .isLength({ min: 3 }).withMessage("pickup is required"),
  body("destination")
    .isString()
    .isLength({ min: 3 }).withMessage("destination is required"),
  body("vehicleType")
    .isString()
    .isIn(["auto", "car", "bike"])
    .withMessage("vehicleType is required"),
  rideController.createRide
);

router.get(
  "/get-fare", authMiddleware.authUser,
  query("pickup")
    .isString()
    .isLength({ min: 3 }).withMessage("pickup is required"),
  query("destination")
    .isString()
    .isLength({ min: 3 }).withMessage("destination is required"),
  rideController.getFare
);
 
router.post(
  "/confirm",
  authMiddleware.authCaptain,
  body("rideId")
    .isString()
    .isLength({ min: 3 }).withMessage("rideId is required"),
  body("captainId")
    .isString()
    .isLength({ min: 3 }).withMessage("captainId is required"),
  rideController.acceptRide
);

router.get(
  "/start-ride",
  authMiddleware.authCaptain,
  query("rideId")
    .isString()
    .isLength({ min: 3 }).withMessage("rideId is required"),
  query("otp")
    .isString()
    .isLength({ min: 3 }).withMessage("otp is required"),
  rideController.startRide
);

module.exports = router;
