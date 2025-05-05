import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CaptainDataContext } from "../context/CaptainContext";

const Captainsignup = () => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [vehicleColor, setVehicleColor] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [vehicleCapacity, setVehicleCapacity] = useState("");
  const [vehicleType, setVehicleType] = useState(""); // Default value

  const { captain, setcaptain } = useContext(CaptainDataContext);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    const captainData = {
      fullname: {
        firstname: firstname,
        lastname: lastname,
      },
      email: email,
      password: password,
      vehicle: {
        color: vehicleColor,
        plate: vehiclePlate,
        capacity: parseInt(vehicleCapacity),
        vehicleType: vehicleType,
      },
    };

    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/captain/register`,
      captainData
    );
    if (response.status === 201) {
      setcaptain(response.data.newCaptain);
      localStorage.setItem("captoken", response.data.token);
      navigate("/captain-home");
    }

    setemail("");
    setpassword("");
    setFirstname("");
    setLastname("");
    setVehicleColor("");
    setVehiclePlate("");
    setVehicleCapacity("");
    setVehicleType("");
  };

  return (
    <div className="p-7 flex flex-col justify-between h-screen">
      <div>
        <img
          className="w-20"
          src="https://www.svgrepo.com/show/505031/uber-driver.svg"
          alt="uber"
        />
        <form onSubmit={(e) => onSubmit(e)}>
          <h3 className="text-xl my-2 font-medium">What's your Name?</h3>
          <div className="flex gap-4">
            <input
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              className="w-1/2 px-4 py-2 border rounded text-lg placeholder:text-base bg-[#eeeeee]"
              required
              type="text"
              placeholder="Firstname"
            />
            <input
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              className="w-1/2 px-4 py-2 border rounded text-lg placeholder:text-base bg-[#eeeeee]"
              type="text"
              placeholder="Lastname"
            />
          </div>

          <h3 className="text-xl my-2 font-medium">What's your Email?</h3>
          <input
            value={email}
            onChange={(e) => setemail(e.target.value)}
            className="w-full px-4 py-2 border rounded text-lg placeholder:text-base bg-[#eeeeee]"
            required
            type="email"
            placeholder="email@example.com"
          />

          <h3 className="text-lg my-2 font-medium">Enter Password</h3>
          <input
            value={password}
            onChange={(e) => setpassword(e.target.value)}
            className="w-full px-4 py-2 border rounded text-lg placeholder:text-base bg-[#eeeeee]"
            type="password"
            required
            placeholder="password"
          />

          <h3 className="text-lg my-2 font-medium">Vehicle Details</h3>
          <div className="grid grid-cols-2 gap-4">
          <input
            value={vehicleColor}
            onChange={(e) => setVehicleColor(e.target.value)}
            className="w-full px-4 py-2 border rounded text-lg placeholder:text-base bg-[#eeeeee]"
            required
            type="text"
            placeholder="Vehicle Color"
          />
          <input
            value={vehiclePlate}
            onChange={(e) => setVehiclePlate(e.target.value)}
            className="w-full px-4 py-2 border rounded text-lg placeholder:text-base bg-[#eeeeee]"
            required
            type="text"
            placeholder="Vehicle Plate Number"
          />
          <input
            value={vehicleCapacity}
            onChange={(e) => setVehicleCapacity(e.target.value)}
            className="w-full px-4 py-2 border rounded text-lg placeholder:text-base bg-[#eeeeee]"
            required
            type="number"
            placeholder="Vehicle Capacity"
          />
          <select
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
            className="w-full px-4 py-2 border rounded text-lg bg-[#eeeeee]"
            required
          >
            <option className="text-xs" value="">Select a vehicle</option>
            <option className="text-xs" value="car">Car</option>
            <option className="text-xs" value="bike">Bike</option>
            <option className="text-xs" value="auto">Auto</option>
          </select>
          </div>

          <button
            type="submit"
            className="font-medium my-2 mt-6 w-full rounded-lg bg-black cursor-pointer text-center text-white py-2 "
          >
            Register
          </button>
        </form>
        <p className="text-center my-3">
          Already have an account?{" "}
          <Link to={"/captain-login"} className="text-blue-600">
            Login Here
          </Link>
        </p>
      </div>
      <p className="text-xs text-center pb-2">
        This site is protected by reCAPTCHA and the{" "}
        <span className="underline">Google Privacy</span>. Policy and{" "}
        <span className="underline">Terms of Service apply</span>.
      </p>
    </div>
  );
};

export default Captainsignup;