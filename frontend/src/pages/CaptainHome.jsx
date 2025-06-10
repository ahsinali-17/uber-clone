import { ArrowLeftFromLine } from 'lucide-react'
import React,{useState,useRef, useEffect, useContext} from 'react'
import { Link } from 'react-router-dom'
import CaptainDetails from '../components/CaptainDetails'
import RidePopup from '../components/RidePopup'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ConfirmRidePopup from '../components/ConfirmRidePopup'
import {SocketContext} from '../context/SocketContext.jsx'
import { CaptainDataContext } from '../context/CaptainContext.jsx'
import axios from 'axios'

const CaptainHome = () => {
  const [ridePopup, setRidePopup] = useState(false);
  const [confirmRidePopup, setConfirmRidePopup] = useState(false);
  const [rideDetails, setRideDetails] = useState(null);

  const ridePopupRef = useRef(null);
  const confirmRidePopupRef = useRef(null);

  const {socket} = useContext(SocketContext);
  const {captain} = useContext(CaptainDataContext);

  const confirmRide = async () => {
    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/ride/confirm`, {
      rideId: rideDetails._id,
      captainId: captain._id,
    },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("captoken")}`,
      },
    }
  ); 
    if (response.status === 200) {
      setRideDetails(response.data.rideUser);
    } else {
      console.log("Error confirming ride", response.data.error);
    }
  }

     //ridepopup
   useGSAP(() => {
    if (ridePopup) {
      gsap.to(ridePopupRef.current, {
        transform: "translateY(0)",
        opacity: 1,
      });
    } else{
      gsap.to(ridePopupRef.current, {
        transform: "translateY(100%)",
        opacity: 0,
      });
    }
  },[ridePopup])

  //confirmridepopup
  useGSAP(() => {
    if (confirmRidePopup) {
      gsap.to(confirmRidePopupRef.current, {
        transform: "translateY(0)",
        opacity: 1,
      });
    } else{
      gsap.to(confirmRidePopupRef.current, {
        transform: "translateY(100%)",
        opacity: 0,
      });
    }
  },[confirmRidePopup])

  useEffect(() => {
    if(socket) {
      socket.emit("join", {userId: captain?._id, userType: "captain"});
    }else {
      console.log("Socket is not connected");
    }

    socket.on("new-ride", (data) => {
      //console.log(data)
      setRideDetails(data);
      setRidePopup(true);
    });  

    const sendCaptainLocation = () => {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        socket.emit("get-captain-location", {
          captainId: captain._id,
          location: { ltd:latitude, lng:longitude },
        });
      });
    }
     
    sendCaptainLocation();
    const interval = setInterval(sendCaptainLocation, 10000);
    // cleanup interval on unmount
    return () => clearInterval(interval);
  },[captain, socket]);

      return (
        <div className="h-screen w-screen overflow-hidden relative">
      <div className='fixed top-0 left-0 w-full flex items-center justify-between p-4 z-10'>
      <img
          className="w-20"
          src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
          alt="uber"
        />
         <Link
        to="/captain-login"
        className="w-11 h-12 rounded-full bg-black flex items-center justify-center"
      >
        <ArrowLeftFromLine className="text-white" />
      </Link>
      </div>
     
      <div className="h-3/5 w-full">
        <img
          className="h-full w-full object-cover object-right"
          src="https://www.medianama.com/wp-content/uploads/2018/06/Screenshot_20180619-112715.png.png"
          alt="map"
        />
      </div>

      <div className="h-2/5 w-full p-4 my-4 flex flex-col justify-start gap-6 bg-white rounded-lg shadow-lg">
      <CaptainDetails/>
      </div>
 
      {/*Ride Popup*/}
      <div ref={ridePopupRef} className="fixed h-auto bottom-0 z-10 bg-white w-full p-3 rounded-t-3xl">
       <RidePopup rideDetails={rideDetails} setRidePopup={setRidePopup} setConfirmRidePopup={setConfirmRidePopup} confirmRide={confirmRide}/>
      </div>

      {/*confirm Ride Popup*/}
      <div ref={confirmRidePopupRef} className="fixed h-screen bottom-0 z-10 bg-white w-full p-3 rounded-t-3xl">
       <ConfirmRidePopup setConfirmRidePopup={setConfirmRidePopup} rideDetails={rideDetails}/>
      </div>
    </div>
  )
}

export default CaptainHome