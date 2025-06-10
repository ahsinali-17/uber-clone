import React,{useEffect,useState} from 'react'
import { MapPinHouse, Navigation, CircleDollarSign } from "lucide-react";
import axios from "axios";

const LookingForDriver = ({ride, setLookingForDriverPanel, vehicle ="car", fare, pickup, destination,setWaitingForDriverPanel}) => {

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


  return (
    <div>
      {" "}
      <div className="flex items-center justify-between w-full mb-2 p-3 ">
        <h2 className="text-2xl font-bold">Looking for Driver</h2>
        <img
          src="/src/assets/down.svg"
          alt=""
          onClick={() => {
            setLookingForDriverPanel(false);
            //setWaitingForDriverPanel(true);
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
              <h2 className="text-lg font-semibold">{pickupcoordinates.ltd + "/" + pickupcoordinates.lng}</h2>
              <p className="text-gray-600 text-md">{pickup}</p>
            </div>
          </div>

          
          <div className="flex items-center justify-start gap-4 border-b-2 border-gray-200 py-2">
            <Navigation />
            <div>
              <h2  className="text-lg font-semibold">{destinationcoordinates.ltd + "/" + pickupcoordinates.lng}</h2>
              <p className="text-gray-600 text-md">{destination}</p>
            </div>
          </div>
          

         
          <div className="flex items-center justify-start gap-4 border-b-2 border-gray-200 py-2">
            <CircleDollarSign /> 
            <div>
              <h2  className="text-lg font-semibold">{fare[vehicle]}</h2>
              <p className="text-gray-600 text-md">Cash Cash</p>
            </div>
          </div>
          </div>
      </div>
    </div>
  )
}

export default LookingForDriver