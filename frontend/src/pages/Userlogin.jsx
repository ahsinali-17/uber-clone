import React,{useState,useContext} from "react";
import { Link } from "react-router-dom";
import {UserDataContext} from '../context/UserContext'
import { useNavigate } from "react-router-dom";
import axios from 'axios'

const Userlogin = () => {
  const [email, setemail] = useState('')
  const [password, setpassword] = useState('')
  const {user,setuser} = useContext(UserDataContext)
  const navigate = useNavigate()

  const onSubmit = async(e) => {
    e.preventDefault()
     const userData = {
      email: email,
      password: password
    }
    
     const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`,userData)
     if(response.status === 200){
       setuser(response.data.user)
       localStorage.setItem('token',response.data.token)
       navigate('/home')
     }

    setemail('')
    setpassword('')
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
            Login As User
          </button>
        </form>
        <p className="text-center my-3">
          don't have an account?{" "}
          <Link to={"/signup"} className="text-blue-600">
            Register As User
          </Link>
        </p>
      </div>
      <Link
        to={"/captain-login"}
        className="font-medium mt-6 w-full rounded-lg bg-[#d98531] cursor-pointer text-center text-white py-2 "
      >
        Login As Captain
      </Link>
    </div>
  );
};

export default Userlogin;
