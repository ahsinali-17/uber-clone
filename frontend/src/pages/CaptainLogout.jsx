import React,{useContext} from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Captainlogout = () => {
    const navigate = useNavigate()
    const token = localStorage.getItem('captoken')
    const logout = async()=>{
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/captain/logout`,{
            headers:{
                Authorization: `Bearer ${token}`
            }
        })
        if(response.status === 200){
            localStorage.removeItem('captoken')
            navigate('/login')
        }
    }
  return (
    <div onMouseOver={logout}>captainlogout</div>
  )
}

export default Captainlogout