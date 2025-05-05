import React,{useContext} from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Userlogout = () => {
    const navigate = useNavigate()
    const token = localStorage.getItem('token')
    const logout = async()=>{
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/logout`,{
            headers:{
                Authorization: `Bearer ${token}`
            }
        })
        if(response.status === 200){
            localStorage.removeItem('token')
            navigate('/login')
        }
    }
  return (
    <div onMouseOver={logout}>Userlogout</div>
  )
}

export default Userlogout