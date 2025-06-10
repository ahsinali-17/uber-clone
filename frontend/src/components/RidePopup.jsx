import React from 'react'
import { MapPinHouse, Navigation, CircleDollarSign } from "lucide-react";
const RidePopup = ({rideDetails ,setRidePopup,setConfirmRidePopup,confirmRide}) => {
  return (
    <>
       {" "}
      <div className="flex items-center justify-between w-full mb-2 p-3 ">
        <h2 className="text-2xl font-bold">Confirm your Ride</h2>
        <img
          src="/src/assets/down.svg"
          alt=""
          onClick={() => {
            setRidePopup(false);
          }}
          className="cursor-pointer"
        />
      </div>

      <div className=" py-3 px-3 flex flex-col items-center w-full gap-6">
        <div className='flex items-center justify-between w-full bg-yellow-400 rounded-lg p-3'>
            <div className='flex items-center gap-2'>
                <img className='h-12 w-12 rounded-full object-cover' src="https://i.pinimg.com/564x/47/74/c1/4774c16ed57e7eff960a338e5a57d71d.jpg" alt="" />
                <h4 className='text-2xl font-semibold'>{rideDetails?.user?.fullname?.firstname + " " + rideDetails?.user?.fullname?.lastname}</h4>
            </div>
            <h4 className='text-xl font-bold text-gray-700'>2.2 KM</h4>
        </div>

        <div className="w-full flex flex-col gap-4">
          <div className="flex items-center justify-start gap-4 border-b-2 border-gray-200 py-2">
            <MapPinHouse />
            <div>
              <h2 className="text-lg font-semibold">{rideDetails?.pickup}</h2>
              <p className="text-gray-600 text-md">{rideDetails?.pickup}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-start gap-4 border-b-2 border-gray-200 py-2">
            <Navigation />
            <div>
              <h2  className="text-lg font-semibold">{rideDetails?.destination}</h2>
              <p className="text-gray-600 text-md">{rideDetails?.destination}</p>
            </div>
          </div>
          

         
          <div className="flex items-center justify-start gap-4 border-b-2 border-gray-200 py-2">
            <CircleDollarSign /> 
            <div>
              <h2  className="text-lg font-semibold">{rideDetails?.fare}</h2>
              <p className="text-gray-600 text-md">Cash Cash</p>
            </div>
          </div>
          </div>
        

        <button onClick={()=>{
           setRidePopup(false);
           setConfirmRidePopup(true);
           confirmRide()
        }} className="bg-green-600 w-full text-center font-semibold text-white text-lg p-2 rounded-lg">Accept</button>
        <button onClick={()=>{
          setRidePopup(false);
        }} className="bg-gray-400 w-full text-center font-semibold text-gray-700 text-lg p-2 rounded-lg">Ignore</button>
      </div>
    </>
  )
}

export default RidePopup