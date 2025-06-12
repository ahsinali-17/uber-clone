import React from "react";
import { House, Navigation, CircleDollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useContext } from "react";
import {SocketContext} from "../context/SocketContext";

const Riding = () => {
  const {socket} = useContext(SocketContext);
  const location = useLocation();
  const navigate = useNavigate();
  const {ride} = location.state || {};
  
    if(socket){
      socket.on("ride-completed", (data)=>{
         navigate("/home");
      });
    }
    else{
      console.log("Socket is not connected");
    }
    
  return (
    <div className="h-screen w-screen overflow-hidden">
      <Link
        to="/home"
        className="fixed top-2 left-2 w-12 h-12 rounded-full bg-black flex items-center justify-center"
      >
        <House className="text-white" />
      </Link>
      <div className="h-1/2 w-full">
        <img
          className="h-full w-full object-cover object-right"
          src="https://www.medianama.com/wp-content/uploads/2018/06/Screenshot_20180619-112715.png.png"
          alt="map"
        />
      </div>

      <div className="h-1/2 w-full p-4 my-2">
        <div className="w-full flex flex-col gap-4 mb-2">
          <div className="items-center flex gap-4 justify-between w-full mb-2">
            <img
              className="h-16"
              src="https://www.pngplay.com/wp-content/uploads/8/Uber-PNG-Photos.png"
              alt=""
            />
            <div className="text-right -mt-2">
              <h3 className="text-base font-medium text-gray-600">{ride?.captain?.fullname?.firstname} {ride?.captain?.fullname?.lastname}</h3>
              <p className="text-xl font-semibold">{ride?.captain?.vehicle?.plate}</p>
              <p className="text-base font-medium text-gray-600">{ride?.captain?.vehicle?.vehicleType}</p>
            </div>
          </div>

          <div className="flex items-center justify-start gap-4 border-b-2 border-gray-200 py-2">
            <Navigation />
            <div>
              <h2 className="text-lg font-semibold">{ride?.destination}</h2>
              <p className="text-gray-600 text-md">{ride?.destination}</p>
            </div>
          </div>

          <div className="flex items-center justify-start gap-4 border-b-2 border-gray-200 py-2">
            <CircleDollarSign />
            <div>
              <h2 className="text-lg font-semibold">{ride?.fare}</h2>
              <p className="text-gray-600 text-md">Cash Cash</p>
            </div>
          </div>
        </div>

        <button className="bg-green-600 w-full text-center font-semibold text-white text-lg p-2 rounded-lg">
          Make a Payment
        </button>
      </div>
    </div>
  );
};

export default Riding;
