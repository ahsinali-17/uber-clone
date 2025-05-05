const express = require("express");
const router = express.Router();
const {
  getCoordinates,
  getDistanceTime,
  getPlaceSuggestions,
} = require("../controllers/maps.controller");
const { authUser } = require("../middlewares/auth.middleware");
const { query } = require("express-validator");

router.get(
  "/get-coordinates",
  query("address")
    .isLength({ min: 3 })
    .withMessage("Address should be at least 3 characters long"),
  authUser,
  getCoordinates
);

router.get(
  "/get-distance-time",
  query("address1")
    .isLength({ min: 3 })
    .withMessage("Origin should be at least 3 characters long"),
  query("address2")
    .isLength({ min: 3 })
    .withMessage("Destination should be at least 3 characters long"),
  authUser,
  getDistanceTime
);

router.get(
  "/get-place-suggestions",
  query("search")
    .isString().isLength({ min: 3 })
    .withMessage("Origin should be at least 3 characters long"),
  authUser,
  getPlaceSuggestions
);

module.exports = router;
