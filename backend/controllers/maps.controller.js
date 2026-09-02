const { validationResult } = require("express-validator");
const axios = require("axios");
const { getDisTime, getAddCoordinates } = require("../services/maps.services");

const mapGeoapifyError = (error) => {
  if (error?.message?.includes("rate limit")) {
    return { status: 429, error: error.message };
  }

  if (error?.message?.includes("timed out") || error?.code === "ECONNABORTED") {
    return { status: 504, error: "Geoapify request timed out." };
  }

  if (error?.message?.includes("upstream") || error?.response?.status >= 500) {
    return { status: 502, error: "Geoapify service is unavailable right now." };
  }

  if (error?.message === "Location not found" || error?.message === "Route not found") {
    return { status: 404, error: error.message };
  }

  return { status: 500, error: error?.message || "Failed to fetch location data." };
};

const getCoordinates = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { address } = req.query;

  try {
    const { ltd, lng } = await getAddCoordinates(address);
    if (!ltd || !lng) {
      return res.status(404).json({ error: "Location not found" });
    }

    res.status(200).json({ ltd, lng });
  } catch (error) {
    const mapped = mapGeoapifyError(error);
    res.status(mapped.status).json({ error: mapped.error });
  }
};

const getDistanceTime = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { address1, address2 } = req.query;

  try {
    const { distance, duration } = await getDisTime(address1, address2);
    if (!distance || !duration) {
      return res.status(404).json({ error: "Route not found" });
    }

    res.status(200).json({ distance, duration });
  } catch (error) {
    const mapped = mapGeoapifyError(error);
    res.status(mapped.status).json({ error: mapped.error });
  }
};

const getPlaceSuggestions = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { search } = req.query;

  try {
    const config = {
      method: "get",
      timeout: 10000,
      url: `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(search)}&format=json&apiKey=${process.env.GEOAPIFY_KEY}`,
      headers: {},
    };

    const response = await axios(config);

    if (response.data && response.data.results && response.data.results.length > 0) {
      const predictions = response.data.results.map((result) => result.formatted);
      res.status(200).json({ predictions });
      return;
    }

    res.status(404).json({ error: "Location not found" });
  } catch (error) {
    const mapped = mapGeoapifyError(error);
    res.status(mapped.status).json({ error: mapped.error });
  }
};

module.exports = { getCoordinates, getDistanceTime, getPlaceSuggestions };
