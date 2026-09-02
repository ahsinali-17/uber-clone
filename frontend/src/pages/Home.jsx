import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
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
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeftFromLine } from "lucide-react";
import LiveLocation from "../components/LiveLocation";

const LOCATION_DEBOUNCE_MS = 350;
const FARE_DEBOUNCE_MS = 450;

const normalizeAddress = (value = "") => value.trim().toLowerCase();

const Home = () => {
  const [pickup, setpickup] = useState("");
  const [destination, setdestination] = useState("");
  const [currentInput, setCurrentInput] = useState("pickup");
  const [vehicle, setVehicle] = useState("car");
  const [fare, setFare] = useState({});
  const [fareKey, setFareKey] = useState("");
  const [ride, setRide] = useState({});
  const [geoCache, setGeoCache] = useState({});
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

  const getCoordinates = useCallback(
    async (address) => {
      const normalized = normalizeAddress(address);
      if (!normalized || normalized.length < 3) {
        return null;
      }

      if (geoCache[normalized]) {
        return geoCache[normalized];
      }

      try {
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
          setGeoCache((prev) => ({ ...prev, [normalized]: response.data }));
          return response.data;
        }
      } catch (error) {
        console.error("Error fetching coordinates:", error);
      }

      return null;
    },
    [geoCache]
  );

  const pickupCoordinates = geoCache[normalizeAddress(pickup)] || null;
  const destinationCoordinates = geoCache[normalizeAddress(destination)] || null;

  useGSAP(() => {
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

    if (openvehiclePanel) {
      gsap.to(vehiclePanelRef.current, {
        transform: "translateY(0)",
        opacity: 1,
      });
    } else {
      gsap.to(vehiclePanelRef.current, {
        transform: "translateY(100%)",
        opacity: 0,
      });
    }

    if (confirmRidePanel) {
      gsap.to(confirmRidePanelRef.current, {
        transform: "translateY(0)",
        opacity: 1,
      });
    } else {
      gsap.to(confirmRidePanelRef.current, {
        transform: "translateY(100%)",
        opacity: 0,
      });
    }

    if (lookingForDriverPanel) {
      gsap.to(lookingForDriverPanelRef.current, {
        transform: "translateY(0)",
        opacity: 1,
      });
    } else {
      gsap.to(lookingForDriverPanelRef.current, {
        transform: "translateY(100%)",
        opacity: 0,
      });
    }

    if (waitingForDriverPanel) {
      gsap.to(waitingForDriverPanelRef.current, {
        transform: "translateY(0)",
        opacity: 1,
      });
    } else {
      gsap.to(waitingForDriverPanelRef.current, {
        transform: "translateY(100%)",
        opacity: 0,
      });
    }
  }, [panelopen, openvehiclePanel, confirmRidePanel, lookingForDriverPanel, waitingForDriverPanel]);

  useEffect(() => {
    const pickupKey = normalizeAddress(pickup);
    const destinationKey = normalizeAddress(destination);

    if (pickupKey.length >= 3 && !geoCache[pickupKey]) {
      const timer = setTimeout(() => {
        getCoordinates(pickup);
      }, LOCATION_DEBOUNCE_MS);

      return () => clearTimeout(timer);
    }

    if (destinationKey.length >= 3 && !geoCache[destinationKey]) {
      const timer = setTimeout(() => {
        getCoordinates(destination);
      }, LOCATION_DEBOUNCE_MS);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [pickup, destination, geoCache, getCoordinates]);

  useEffect(() => {
    const pickupKey = normalizeAddress(pickup);
    const destinationKey = normalizeAddress(destination);

    if (pickupKey.length < 3 || destinationKey.length < 3) {
      return undefined;
    }

    const nextFareKey = `${pickupKey}|${destinationKey}`;
    if (nextFareKey === fareKey) {
      return undefined;
    }

    const timer = setTimeout(async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/ride/get-fare`, {
          params: {
            pickup,
            destination,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.status === 200) {
          setFare(response.data.fare);
          setFareKey(nextFareKey);
        }
      } catch (error) {
        console.error("Error fetching fare:", error);
      }
    }, FARE_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [pickup, destination, fareKey]);

  useEffect(() => {
    if (!socket) {
      console.log("Socket is not connected");
      return undefined;
    }

    socket.emit("join", { userId: user?._id, userType: "user" });

    const handleRideAccepted = (data) => {
      setRide(data);
      setWaitingForDriverPanel(true);
      setLookingForDriverPanel(false);
    };

    const handleRideStarted = (data) => {
      setWaitingForDriverPanel(false);
      setLookingForDriverPanel(false);
      navigate("/riding", { state: { ride: data.ride } });
    };

    socket.on("ride-accepted", handleRideAccepted);
    socket.on("ride-started", handleRideStarted);

    return () => {
      socket.off("ride-accepted", handleRideAccepted);
      socket.off("ride-started", handleRideStarted);
    };
  }, [user, socket, navigate]);

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <div className="fixed top-0 left-0 w-full flex items-center justify-between p-4 z-10">
        <img
          className="w-20"
          src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
          alt="uber"
        />
        <Link
          to="/login"
          className="w-11 h-12 rounded-full bg-black flex items-center justify-center"
          onClick={() => {
            localStorage.removeItem("token");
          }}
        >
          <ArrowLeftFromLine className="text-white" />
        </Link>
      </div>
      <div className="h-screen w-screen">
        <LiveLocation className="h-[70%]" />
      </div>

      <div className="absolute bottom-0 flex flex-col justify-end h-full w-full">
        <div className="bg-white rounded-lg p-5 h-[30%] pt-20">
          <div className="flex items-center justify-between">
            <h4 className="text-2xl font-semibold">Find a trip</h4>
            <img
              ref={panelClose}
              onClick={() => {
                setpanelopen(false);
              }}
              className={`w-8`}
              src="src\assets\down.svg"
              alt=""
            />
          </div>
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

        <div ref={panelRef} className={` bg-white h-0 z-20`}>
          <SearchPanel
            currentInput={currentInput}
            destination={destination}
            pickup={pickup}
            setdestination={setdestination}
            setpickup={setpickup}
            setpanelopen={setpanelopen}
            setOpenvehiclePanel={setOpenvehiclePanel}
          />
        </div>
      </div>

      <div ref={vehiclePanelRef} className="fixed h-auto bottom-0 z-20 bg-white w-full p-3 rounded-t-3xl">
        <VehiclePanel fare={fare} setVehicle={setVehicle} setOpenvehiclePanel={setOpenvehiclePanel} setConfirmRidePanel={setConfirmRidePanel} />
      </div>

      <div ref={confirmRidePanelRef} className="fixed h-auto bottom-0 z-20 bg-white w-full p-3 rounded-t-3xl">
        <ConfirmRide
          setRide={setRide}
          pickup={pickup}
          destination={destination}
          vehicle={vehicle}
          fare={fare}
          setConfirmRidePanel={setConfirmRidePanel}
          setLookingForDriverPanel={setLookingForDriverPanel}
          pickupCoordinates={pickupCoordinates}
          destinationCoordinates={destinationCoordinates}
        />
      </div>

      <div ref={lookingForDriverPanelRef} className="fixed h-auto bottom-0 z-20 bg-white w-full p-3 rounded-t-3xl">
        <LookingForDriver
          ride={ride}
          setRide={setRide}
          pickup={pickup}
          destination={destination}
          vehicle={vehicle}
          fare={fare}
          setLookingForDriverPanel={setLookingForDriverPanel}
          pickupCoordinates={pickupCoordinates}
          destinationCoordinates={destinationCoordinates}
        />
      </div>

      <div ref={waitingForDriverPanelRef} className="fixed h-auto bottom-0 z-20 bg-white w-full p-3 rounded-t-3xl">
        <WaitingForDriver setWaitingForDriverPanel={setWaitingForDriverPanel} ride={ride} />
      </div>
    </div>
  );
};

export default Home;
