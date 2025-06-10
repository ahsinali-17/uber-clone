import React from 'react'
import { MapPinHouse, Navigation, CircleDollarSign } from "lucide-react";
import {useNavigate} from 'react-router-dom'

const WaitingForDriver = ({setWaitingForDriverPanel, ride}) => {
  const navigate = useNavigate()
  return (
    <div> 
    {" "}
    <div className="flex items-center justify-center w-full mb-2 p-3 ">
      <img
        src="/src/assets/down.svg"
        alt=""
        onClick={() => {setWaitingForDriverPanel(false); navigate('/riding')} }
        className="cursor-pointer"
      />
    </div>

    <div className=" py-3 px-6 flex flex-col items-center w-full gap-6">
      <div className='items-center flex gap-4 justify-between w-full'>
      <img
        className="h-16"
        src="https://www.pngplay.com/wp-content/uploads/8/Uber-PNG-Photos.png"
        alt=""
      />
      <div className='text-right -mt-2'>
        <h3 className='text-base font-medium text-gray-600'>{ride?.captain?.fullname?.firstname + " " + ride?.captain?.fullname?.lastname}</h3>
        <p className='text-xl font-semibold'>{ride?.captain?.vehicle?.plate}</p>
        <p className='text-base font-medium text-gray-600'>{ride?.captain?.vehicle?.vehicleType}</p>
        <h3 className='text-xl font-medium text-black'>{ride?.otp}</h3>
      </div>
</div>
      <div className="w-full flex flex-col gap-4">
        <div className="flex items-center justify-start gap-4 border-b-2 border-gray-200 py-2">
          <MapPinHouse />
          <div> 
            <h2 className="text-lg font-semibold">{ride?.pickup}</h2>
            <p className="text-gray-600 text-md">{ride?.pickup}</p>
          </div>
        </div>

        
        <div className="flex items-center justify-start gap-4 border-b-2 border-gray-200 py-2">
          <Navigation />
          <div>
            <h2  className="text-lg font-semibold">{ride?.destination}</h2>
            <p className="text-gray-600 text-md">{ride?.destination}</p>
          </div>
        </div>
        

       
        <div className="flex items-center justify-start gap-4 border-b-2 border-gray-200 py-2">
          <CircleDollarSign /> 
          <div>
            <h2  className="text-lg font-semibold">{ride?.fare}</h2>
            <p className="text-gray-600 text-md">Cash Cash</p>
          </div>
        </div>
        </div>
    </div>
  </div>
  )
}

export default WaitingForDriver