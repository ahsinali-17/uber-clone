const { validationResult } = require("express-validator");
const {getDisTime, getAddCoordinates} = require("../services/maps.services");
const axios = require("axios");

const getCoordinates = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { address } = req.query;
   
  //const {ltd, lng} = await getAddCoordinates(address)
  //if(!ltd || !lng) {
  //  return res.status(404).json({ error: "Location not found" });
  //}
  res.status(200).json({
      ltd:33.7870848,
      lng:72.7252992,
  });
};

const getDistanceTime = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { address1, address2 } = req.query;
  
  //const { distance, duration } = await getDisTime(address1, address2);
  //if(!distance || !duration) {
   //return res.status(404).json({ error: "Route not found" });
  //}
      res.status(200).json({
       distance:109,
        duration:60,
      });  
};

const getPlaceSuggestions = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { search } = req.query;
  try {
    const url = `https://maps.gomaps.pro/maps/api/place/autocomplete/json`;

    //const response = await axios.get(url, {
    //  params: {
    //    input: search,
    //    key: process.env.GOMAPAPI_KEY,
    //  },
    //});

    //if (response.data.status === "OK" && response.data?.predictions?.length > 0) {
    //  const predictions = response.data.predictions.map((prediction)=> prediction.description);
      res.status(200).json({
        predictions: ["Wah Cantt, Pakistan", "Taxila, Pakistan", "location3"],
      });
    //} else {
    //  res.status(404).json({ error: "location not found" });
    //}
  } catch (error) {
    console.error("Error fetching location from GoMapAPI:", error);
    res.status(404).json({ error: "Location not found" });
  }
};


module.exports = { getCoordinates, getDistanceTime, getPlaceSuggestions };
