import React, { useEffect, useState } from "react";
import axios from "axios";

const SearchPanel = ({
  setOpenvehiclePanel,
  setpanelopen,
  pickup,
  destination,
  setpickup,
  setdestination,
  currentInput,
}) => {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/maps/get-place-suggestions`,
          {
            params: {
              search: currentInput === "pickup" ? pickup : destination
            },
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        ); // Replace with your API endpoint
        if (response.status === 200) setLocations(response.data.predictions); // Adjust according to your API response structure
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };
    if((currentInput==="pickup" && pickup.length>=3) || (currentInput==="destination" && destination.length>=3))
    fetchLocations();
  }, [pickup, destination]);
  return (
    <div>
      {locations.map((location, index) => {
        return (
          <div
            key={index}
            onClick={() => {
              currentInput === "pickup"
            ? setpickup(location)
            : setdestination(location);
              destination && pickup && setOpenvehiclePanel(true);
              destination && pickup && setpanelopen(false);
            }}
            className="flex items-center justify-items-start gap-4 my-2 border-2 border-gray-100 active:border-black rounded-xl p-2"
          >
            <h2 className="bg-[#eee] py-3 rounded-full w-10 h-10 flex justify-center items-center">
              <img
            src="src/assets/location.svg"
            alt="location"
            className="w-6 h-6"
              />
            </h2>
            <h4 className="text-lg font-semibold w-2/3">{location}</h4>
          </div>
        );
      })}
    </div>
  );
};

export default SearchPanel;
