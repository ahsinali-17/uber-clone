import React, { useState } from 'react';
import axios from 'axios';
import { MapPinHouse, Navigation, CircleDollarSign } from "lucide-react";

const LookingForDriver = ({
  setLookingForDriverPanel,
  vehicle = "car",
  fare,
  pickup,
  destination,
  ride,
  setRide,
  pickupCoordinates,
  destinationCoordinates,
}) => {
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState("");

  const cancelRide = () => {
    if (!ride?._id || isCancelling) {
      return;
    }

    setIsCancelling(true);
    setCancelError("");

    axios.delete(`${import.meta.env.VITE_BASE_URL}/ride/${ride._id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(() => {
        setRide({});
        setLookingForDriverPanel(false);
      })
      .catch((error) => {
        setCancelError(error.response?.data?.error || "Unable to cancel ride");
      })
      .finally(() => setIsCancelling(false));
  }
  return (
    <div>
      <div className="flex items-center justify-between w-full mb-2 p-3 ">
        <h2 className="text-2xl font-bold">Looking for Driver</h2>
        <img
          src="/src/assets/down.svg"
          alt=""
          onClick={() => {
            setLookingForDriverPanel(false);
          }}
          className="cursor-pointer"
        />
      </div>

      <div className=" py-3 px-6 flex flex-col items-center w-full gap-6">
        <img
          className="h-28"
          src="https://www.pngplay.com/wp-content/uploads/8/Uber-PNG-Photos.png"
          alt=""
        />

        <div className="w-full flex flex-col gap-4">
          <div className="flex items-center justify-start gap-4 border-b-2 border-gray-200 py-2">
            <MapPinHouse />
            <div>
              <h2 className="text-lg font-semibold">
                {pickupCoordinates ? `${pickupCoordinates.ltd}/${pickupCoordinates.lng}` : ""}
              </h2>
              <p className="text-gray-600 text-md">{pickup}</p>
            </div>
          </div>

          <div className="flex items-center justify-start gap-4 border-b-2 border-gray-200 py-2">
            <Navigation />
            <div>
              <h2 className="text-lg font-semibold">
                {destinationCoordinates ? `${destinationCoordinates.ltd}/${destinationCoordinates.lng}` : ""}
              </h2>
              <p className="text-gray-600 text-md">{destination}</p>
            </div>
          </div>

          <div className="flex items-center justify-start gap-4 border-b-2 border-gray-200 py-2">
            <CircleDollarSign />
            <div>
              <h2 className="text-lg font-semibold">{fare?.[vehicle]}</h2>
              <p className="text-gray-600 text-md">Cash Cash</p>
            </div>
          </div>
           {cancelError && <p className="text-sm text-red-600">{cancelError}</p>}
           <button
             className="bg-red-600 w-full text-center font-semibold text-white text-lg p-2 rounded-lg cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
             onClick={cancelRide}
             disabled={!ride?._id || isCancelling}
           >
             {isCancelling ? "Cancelling..." : "Cancel Ride"}
           </button>
        </div>
      </div>
    </div>
  );
};

export default LookingForDriver;
