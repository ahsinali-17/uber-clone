import React,{useEffect, useState} from "react";
import axios from "axios";
import { MapPinHouse, Navigation, CircleDollarSign } from "lucide-react";

const ConfirmRide = ({ setConfirmRidePanel, setLookingForDriverPanel, vehicle ="car", fare, pickup, destination, setRide }) => {

  const [pickupcoordinates, setPickupCoordinates] = useState({});
  const [destinationcoordinates, setDestinationCoordinates] = useState({});

  useEffect(() => {
    const getCoordinates = async (address) => {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/maps/get-coordinates`,
        {
          params: { address },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 200) {
        return response.data;
      } else {
        console.error("Error fetching coordinates:", response.data.error);
      }
    }

    if(pickup.length > 3 && destination.length > 3){
      getCoordinates(pickup).then((data) => {
        setPickupCoordinates(data);
      });
      getCoordinates(destination).then((data) => {
        setDestinationCoordinates(data);
      });
    }
  },[pickup, destination]);
   
  const vehicleImgs = {
    bike: "./Uber_Moto.webp",
    auto: "./Uber_Auto.webp",
    car: "./Uber-car.png",
  }

  const handleConfirm = async() => {
     try{
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/ride/create`,
        {
          pickup,
          destination,
          vehicleType: vehicle,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
;
      if (response.status === 201) {
        setRide(response.data.ride);
        setConfirmRidePanel(false);
        setLookingForDriverPanel(true);
      }
     }catch(err){
       console.log(err);
     }
  }
  return (
    <div>
      {" "}
      <div className="flex items-center justify-between w-full mb-2 p-3 ">
        <h2 className="text-2xl font-bold">Confirm your Ride</h2>
        <img
          src="/src/assets/down.svg"
          alt=""
          onClick={() => {
            setConfirmRidePanel(false);
          }}
          className="cursor-pointer"
        />
      </div>

      <div className=" py-3 px-6 flex flex-col items-center w-full gap-6">
        <img
          className="h-28"
          src={vehicleImgs[vehicle]}
          alt={vehicle}
        />

        <div className="w-full flex flex-col gap-4">
          <div className="flex items-center justify-start gap-4 border-b-2 border-gray-200 py-2">
            <MapPinHouse />
            <div>
              <h2 className="text-lg font-semibold">{pickupcoordinates.lat + "/" + pickupcoordinates.lng}</h2>
              <p className="text-gray-600 text-md">{pickup}</p>
            </div>
          </div>

          
          <div className="flex items-center justify-start gap-4 border-b-2 border-gray-200 py-2">
            <Navigation />
            <div>
              <h2  className="text-lg font-semibold">{destinationcoordinates.lat + "/" + destinationcoordinates.lng}</h2>
              <p className="text-gray-600 text-md">{destination}</p>
            </div>
          </div>
          

         
          <div className="flex items-center justify-start gap-4 border-b-2 border-gray-200 py-2">
            <CircleDollarSign /> 
            <div>
              <h2  className="text-lg font-semibold">{fare[vehicle] || ""}</h2>
              <p className="text-gray-600 text-md">Cash Cash</p>
            </div>
          </div>
          </div>
        

        <button onClick={handleConfirm} className="bg-green-600 w-full text-center font-semibold text-white text-lg p-2 rounded-lg">Confirm</button>
      </div>
    </div>
  );
};

export default ConfirmRide;
