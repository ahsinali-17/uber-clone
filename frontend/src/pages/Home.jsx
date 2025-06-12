import React, { useContext, useState, useRef, useEffect, use } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import SearchPanel from "../components/SearchPanel";
import VehiclePanel from "../components/VehiclePanel";
import ConfirmRide from "../components/ConfirmRide";
import LookingForDriver from "../components/LookingForDriver";
import WaitingForDriver from "../components/WaitingForDriver";
import axios from "axios";
import { SocketContext } from "../context/SocketContext";
import { UserDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [pickup, setpickup] = useState("");
  const [destination, setdestination] = useState("");
  const [currentInput, setCurrentInput] = useState("pickup");
  const [vehicle, setVehicle] = useState("car");
  const [fare, setFare] = useState({});
  const [ride, setRide] = useState({});
  const [panelopen, setpanelopen] = useState(false);
  const [openvehiclePanel, setOpenvehiclePanel] = useState(false);
  const [confirmRidePanel, setConfirmRidePanel] = useState(false);
  const [lookingForDriverPanel, setLookingForDriverPanel] = useState(false);
  const [waitingForDriverPanel, setWaitingForDriverPanel] = useState(false);

  const panelRef = useRef(null);
  const panelClose = useRef(null);
  const vehiclePanelRef = useRef(null);
  const confirmRidePanelRef = useRef(null);
  const lookingForDriverPanelRef = useRef(null);
  const waitingForDriverPanelRef = useRef(null);

  const { socket } = useContext(SocketContext);
  const { user } = useContext(UserDataContext);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
  };

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

  useGSAP(() => {
    //panelopen
    if (panelopen) {
      gsap.to(panelRef.current, {
        height: "70%",
        paddingLeft: "16px",
        paddingRight: "16px",
        opacity: 1,
      });
      gsap.to(panelClose.current, {
        opacity: 1,
      });
    } else {
      gsap.to(panelRef.current, {
        height: "0%",
        opacity: 0,
      });
      gsap.to(panelClose.current, {
        opacity: 0,
      });
    }

    //vehiclepanel
    if (openvehiclePanel) {
      gsap.to(vehiclePanelRef.current, {
        transform: "translateY(0)",
        opacity: 1,
      });
    } else{
      gsap.to(vehiclePanelRef.current, {
        transform: "translateY(100%)",
        opacity: 0,
      });
    }

    //confirmride
    if (confirmRidePanel) {
      gsap.to(confirmRidePanelRef.current, {
        transform: "translateY(0)",
        opacity: 1,
      });
    } else{
      gsap.to(confirmRidePanelRef.current, {
        transform: "translateY(100%)",
        opacity: 0,
      });
    }

    //looking for driver
    if (lookingForDriverPanel) {
      gsap.to(lookingForDriverPanelRef.current, {
        transform: "translateY(0)",
        opacity: 1,
      });
    } else{
      gsap.to(lookingForDriverPanelRef.current, {
        transform: "translateY(100%)",
        opacity: 0,
      });
    }

    //waiting for driver
    if (waitingForDriverPanel) {
      gsap.to(waitingForDriverPanelRef.current, {
        transform: "translateY(0)",
        opacity: 1,
      });
    } else{
      gsap.to(waitingForDriverPanelRef.current, {
        transform: "translateY(100%)",
        opacity: 0,
      });
    }

  }, [panelopen,openvehiclePanel, confirmRidePanel, lookingForDriverPanel, waitingForDriverPanel]);

  useEffect(() => {
   const getFare = async(pickup, destination) =>{
     const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/ride/get-fare`, {
        params: {
          pickup: pickup,
          destination: destination,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if(response.status === 200)
      setFare(response.data.fare);
    }
    if( pickup.length>=3 && destination.length>=3)
    getFare(pickup, destination);
  },[pickup, destination]);

  useEffect(() => {
    if (socket) {
   socket.emit("join", { userId: user._id, userType: "user" });
    }
    else {
      console.log("Socket is not connected");
    }

    socket.on("ride-accepted", (data) => {
      setRide(data);
      setWaitingForDriverPanel(true);
      setLookingForDriverPanel(false);
    })

    socket.on("ride-started", (data) => {
      setWaitingForDriverPanel(false);
      setLookingForDriverPanel(false);
      navigate('/riding', {state: {ride:data.ride}});
    })
  },[user,socket])

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <div className="">
        <img
          className="w-20 top-6 left-5 absolute"
          src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
          alt="uber"
        />
      </div>
      <div className="h-screen w-screen"> 
        <img
          className="h-full w-full object-cover object-right"
          src="https://www.medianama.com/wp-content/uploads/2018/06/Screenshot_20180619-112715.png.png"
          alt="map"
        />
      </div>
      
      {/*Find a trip*/}
      <div className="absolute bottom-0 flex flex-col justify-end h-full w-full">
        <div className="bg-white rounded-lg p-5 h-[30%]">
          <h4 className="text-2xl font-semibold">Find a trip</h4>
          <img
            ref={panelClose}
            onClick={() => {
              setpanelopen(false);
            }}
            className={`absolute right-5 top-5 w-8`}
            src="src\assets\down.svg"
            alt=""
          />
          <form className="relative" onSubmit={(e) => handleSubmit(e)}>
            <div className="line w-1 h-14 absolute top-10 rounded-full left-3 bg-black"></div>
            <input
              className="w-full rounded-lg px-8 py-2 mt-5 bg-[#eee]"
              type="text"
              placeholder="Add a pick-up location"
              value={pickup}
              onChange={(e) => setpickup(e.target.value)}
              onClick={() => setpanelopen(true)}
              onFocus={() => setCurrentInput("pickup")}
            />
            <input
              className="w-full rounded-lg px-8 py-2 mt-3 bg-[#eee]"
              type="text"
              placeholder="Add your destination"
              value={destination}
              onChange={(e) => setdestination(e.target.value)}
              onClick={() => setpanelopen(true)}
              onFocus={() => setCurrentInput("destination")}
            />
          </form>
        </div>

        <div ref={panelRef} className={` bg-white h-0`}>
          <SearchPanel currentInput={currentInput} destination={destination} pickup={pickup} setdestination= {setdestination} setpickup={setpickup} setpanelopen={setpanelopen} setOpenvehiclePanel={setOpenvehiclePanel} />
        </div>
      </div>

      {/*Choose a vehicle*/}
      <div ref={vehiclePanelRef} className="fixed h-auto bottom-0 z-10 bg-white w-full p-3 rounded-t-3xl">
       <VehiclePanel fare={fare} setVehicle={setVehicle} setOpenvehiclePanel={setOpenvehiclePanel} setConfirmRidePanel={setConfirmRidePanel} />
      </div>

      {/*Confirm ride*/}
      <div ref={confirmRidePanelRef} className="fixed h-auto bottom-0 z-10 bg-white w-full p-3 rounded-t-3xl">
       <ConfirmRide setRide= {setRide} pickup={pickup} destination={destination} vehicle={vehicle} fare={fare} setConfirmRidePanel={setConfirmRidePanel} setLookingForDriverPanel={setLookingForDriverPanel} getCoordinates={getCoordinates}/>
      </div>

      {/*Looking for a driver */}
      <div ref={lookingForDriverPanelRef} className="fixed h-auto bottom-0 z-10 bg-white w-full p-3 rounded-t-3xl">
       <LookingForDriver ride={ride} pickup={pickup} destination={destination} vehicle={vehicle} fare={fare} setLookingForDriverPanel={setLookingForDriverPanel} setWaitingForDriverPanel={setWaitingForDriverPanel} getCoordinates={getCoordinates}/>
      </div>

      {/*Waiting for the driver*/}
      <div ref={waitingForDriverPanelRef} className="fixed h-auto bottom-0 z-10 bg-white w-full p-3 rounded-t-3xl">
       <WaitingForDriver setWaitingForDriverPanel={setWaitingForDriverPanel} ride={ride}/>
      </div>
    </div>
  );
};

export default Home;
