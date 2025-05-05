import React,{useState, useContext} from "react";
import { Link } from "react-router-dom";
import axios from 'axios'
import {UserDataContext} from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const UserSignup = () => {
  const [email, setemail] = useState('')
  const [password, setpassword] = useState('')
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const {user, setuser} = useContext(UserDataContext)
  const navigate = useNavigate()

  const onSubmit =async (e) => {
    e.preventDefault()
     const userData = {
      fullname:{
        firstname: firstname,
        lastname: lastname
      },
      email: email,
      password: password
    }

    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`, userData)
    if(response.status === 201){
      setuser(response.data.user)
      localStorage.setItem('token',response.data.token)
      navigate('/home')
    }

    setemail('')
    setpassword('')
    setFirstname('')
    setLastname('')
  }

  return (
    <div className="p-7 flex flex-col justify-between h-screen">
      <div>
        <img
          className="w-20 mb-6"
          src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
          alt="uber"
        />
        <form onSubmit={(e)=>onSubmit(e)}>
        <h3 className="text-xl my-2 font-medium">What's your Name?</h3>
        <div className="flex gap-4">
          <input value={firstname}
          onChange={(e)=>setFirstname(e.target.value)}
            className="w-1/2 px-4 py-2 border rounded text-lg placeholder:text-base bg-[#eeeeee]"
            required
            type="text"
            placeholder="Firstname"/>
          <input value={lastname}
          onChange={(e)=>setLastname(e.target.value)}
            className="w-1/2 px-4 py-2 border rounded text-lg placeholder:text-base bg-[#eeeeee]"
            type="text"
            placeholder="Lastname"/>
        </div>
        
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
            Register
          </button>
        </form>
        <p className="text-center my-3">
          Already have an account?{" "}
          <Link to={"/login"} className="text-blue-600">
            Login Here
          </Link>
        </p>
      </div>
      <p className="text-xs text-center">This site is protected by reCAPTCHA and the <span  className="underline">Google Privacy</span>. Policy and <span className="underline">Terms of Service apply</span>.</p>
    </div>
  );
};

export default UserSignup;
