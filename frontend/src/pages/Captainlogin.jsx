import React,{useState,useContext} from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CaptainDataContext } from "../context/CaptainContext";

const Captainlogin = () => {
  const [email, setemail] = useState('')
  const [password, setpassword] = useState('')
  const {captain,setcaptain} = useContext(CaptainDataContext)
  const navigate = useNavigate()

  const onSubmit = async(e) => {
    e.preventDefault()
     const captainData = {
      email: email,
      password: password
    }

    let response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/captain/login`,
      captainData
    );
    if (response.status === 200) {
      setcaptain(response.data.captain);
      localStorage.setItem("captoken", response.data.token);
      navigate("/captain-home");
    }

    setemail('')
    setpassword('')
  }

  return (
    <div className="p-7 flex flex-col justify-between h-screen">
      <div>
        <img
          className="w-20"
          src="https://www.svgrepo.com/show/505031/uber-driver.svg"
          alt="uber"
        />
        <form onSubmit={(e)=>onSubmit(e)}>
          <h3 className="text-xl my-2 font-medium">What's your Email?</h3>
          <input
          value={email}
          onChange={(e)=>setemail(e.target.value)}
            className="w-full px-4 py-2 border rounded text-lg placeholder:text-base bg-[#eeeeee]"
            required
            type="email"
            placeholder="email@example.com"
          />
          <h3 className="text-lg my-2 font-medium">Enter Password</h3>
          <input
          value={password}
          onChange={(e)=>setpassword(e.target.value)}
            className="w-full px-4 py-2 border rounded text-lg placeholder:text-base bg-[#eeeeee]"
            type="password"
            required
            placeholder="password"
          />
          <button
            type="submit"
            className="font-medium mt-6 w-full rounded-lg bg-black cursor-pointer text-center text-white py-2 "
          >
            Login As Captain
          </button>
        </form>
        <p className="text-center my-3">
          Don't have an account?{" "}
          <Link to={"/captain-signup"} className="text-blue-600">
            Register As Captain
          </Link>
        </p>
      </div>
      <Link
        to={"/login"}
        className="font-medium mt-6 w-full rounded-lg bg-[#1cbe72] cursor-pointer text-center text-white py-2 "
      >
        Login As User
      </Link>
    </div>
  );
};

export default Captainlogin;
