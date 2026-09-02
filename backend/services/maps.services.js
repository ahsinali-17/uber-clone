const axios = require("axios");
const Captain = require("../models/captain.model");

const GEOAPIFY_TIMEOUT_MS = 10000;

const buildGeoapifyConfig = ({ method, url, data = null }) => ({
  method,
  url,
  timeout: GEOAPIFY_TIMEOUT_MS,
  headers: {},
  ...(data ? { data } : {}),
});

const normalizeGeoapifyError = (error) => {
  if (error?.response?.status === 429) {
    return new Error("Geoapify rate limit exceeded. Please try again shortly.");
  }

  if (error?.code === "ECONNABORTED") {
    return new Error("Geoapify request timed out.");
  } 

  if (error?.response?.status >= 500) {
    return new Error("Geoapify upstream service failed. Please try again later.");
  }

  if (error?.message) {
    return new Error(error.message);
  }

  return new Error("Geoapify request failed.");
};

const getDisTime = async (address1, address2, coordinates = {}) => {
  const hasCoordinates = coordinates.startCoords && coordinates.endCoords;
  const [startCoords, endCoords] = hasCoordinates
    ? [coordinates.startCoords, coordinates.endCoords]
    : await Promise.all([
        getAddCoordinates(address1),
        getAddCoordinates(address2),
      ]);

  if (!startCoords || !endCoords) {
    throw new Error("Could not geocode one or both addresses.");
  }

  const config = buildGeoapifyConfig({
    method: "post",
    url: `https://api.geoapify.com/v1/routematrix?apiKey=${process.env.GEOAPIFY_KEY}`,
    data: {
      mode: "drive",
      sources: [{ location: [startCoords.lng, startCoords.ltd] }],
      targets: [{ location: [endCoords.lng, endCoords.ltd] }],
    },
  });

  try {
    const response = await axios(config);
    const routeSet = response?.data?.sources_to_targets?.[0]?.[0];

    if (!routeSet || typeof routeSet.distance !== "number" || typeof routeSet.time !== "number") {
      throw new Error("Route not found");
    }

    return {
      distance: (routeSet.distance / 1000).toFixed(1) + " km",
      duration: Math.round(routeSet.time / 60) + " mins",
    };
  } catch (error) {
    throw normalizeGeoapifyError(error);
  }
};

const getAddCoordinates = async (address) => {
  if (!address) {
    throw new Error("Address is required.");
  }

  const config = buildGeoapifyConfig({
    method: "get",
    url: `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(address)}&format=json&apiKey=${process.env.GEOAPIFY_KEY}`,
  });

  try {
    const response = await axios(config);
    const location = response?.data?.results?.[0];

    if (!location || typeof location.lat !== "number" || typeof location.lon !== "number") {
      throw new Error("Location not found");
    }

    return {
      ltd: location.lat,
      lng: location.lon,
    };
  } catch (error) {
    throw normalizeGeoapifyError(error);
  }
};

const getCaptainInRange = async (ltd, lng, radius) => {
  try {
    const latitudeDelta = radius / 111.32;
    const longitudeDelta = radius / (111.32 * Math.cos((ltd * Math.PI) / 180));

    const captains = await Captain.find({
      socketId: { $exists: true, $ne: "" },
      "location.ltd": { $gte: ltd - latitudeDelta, $lte: ltd + latitudeDelta },
      "location.lng": { $gte: lng - longitudeDelta, $lte: lng + longitudeDelta },
    });

    return captains;
  } catch (error) {
    console.error("Error fetching captains in range:", error);
    throw error;
  }
};

module.exports = { getDisTime, getCaptainInRange, getAddCoordinates };