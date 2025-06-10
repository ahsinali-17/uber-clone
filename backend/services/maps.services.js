const axios = require("axios");
const Captain = require("../models/captain.model");

const getDisTime = async (address1, address2) => {

    if(!address1 || !address2)
        throw new Error("pickup and destination are required."); 

    try {
        const url = `https://maps.gomaps.pro/maps/api/distancematrix/json`;
    
        //const response = await axios.get(url, {
        //  params: {
        //    origins: address1,
        //    destinations: address2,
        //    key: process.env.GOMAPAPI_KEY,
        //  },
        //});
    
      //  if (response.data.status === "OK" && response.data?.rows?.length > 0 && response.data?.rows[0]?.elements?.length > 0) {
      //    const row = response.data.rows[0];
    //
      //    const distance = row.elements[0]?.distance?.text;
      //    const duration = row.elements[0]?.duration?.text;
    
          return{
           distance :65,
            duration:56,
          };
       // } else {
       //   return { error: "Route not found" };
       // }
      } catch (error) {
        console.error("Error fetching route from GoMapAPI:", error);
      }
}

const getAddCoordinates = async (address) => {
  if(!address) {
    throw new Error("Address is required.");
  }
  try {
      const url = `https://maps.gomaps.pro/maps/api/geocode/json`;
  
     // const response = await axios.get(url, {
     //   params: {
     //     address: address,
     //     key: process.env.GOMAPAPI_KEY,
     //   },
     // });
     // if (response.data.status === "OK" && response.data?.results?.length > 0) {
     //   const location = response.data.results[0]?.geometry?.location;
        return {
          //ltd: location.lat,
          //lng: location.lng,
          ltd: 33.7870848,
          lng: 72.7252992,
        };
      //} else return { error: "Location not found" };
    } catch (error) {
      console.error("Error fetching coordinates from GoMapAPI:", error);
    }
}

const getCaptainInRange = async (ltd, lng, radius) => {
  try {
    let captains = await Captain.find({
      location: {
        $geoWithin: {
          $centerSphere: [[lng, ltd], radius / 6371], // radius in kilometer
        },
      },
    });
    
    return captains;
  } catch (error) {
    console.error("Error fetching captains in range:", error);
    throw new Error("Failed to fetch captains in range.");
  }
}

module.exports = { getDisTime, getCaptainInRange, getAddCoordinates };