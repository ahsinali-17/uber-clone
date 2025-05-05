import React from 'react'
import { useNavigate } from 'react-router-dom';
import { MapPinHouse, Navigation, CircleDollarSign } from "lucide-react";

const FinishRide = ({setFinishRidePanel}) => {
    const navigate = useNavigate()
  return (
    <>
    {" "}
   <div className="flex items-center justify-between w-full mb-2 p-3 ">
     <h2 className="text-2xl font-bold">Confirm your Ride</h2>
     <img
       src="/src/assets/down.svg"
       alt=""
       onClick={() => {
         setFinishRidePanel(false);
       }}
       className="cursor-pointer"
     />
   </div>

   <div className=" py-3 px-3 flex flex-col items-center w-full gap-6">
     <div className='flex items-center justify-between w-full border-2 border-yellow-400 rounded-lg p-3'>
         <div className='flex items-center gap-2'>
             <img className='h-12 w-12 rounded-full object-cover' src="https://i.pinimg.com/564x/47/74/c1/4774c16ed57e7eff960a338e5a57d71d.jpg" alt="" />
             <h4 className='text-2xl font-semibold'>Ahsin Ali</h4>
         </div>
         <h4 className='text-xl font-bold text-gray-700'>2.2 KM</h4>
     </div>

     <div className="w-full flex flex-col gap-4">
       <div className="flex items-center justify-start gap-4 border-b-2 border-gray-200 py-2">
         <MapPinHouse />
         <div>
           <h2 className="text-lg font-semibold">CB-378, Sabri Street</h2>
           <p className="text-gray-600 text-md">Munirabad, Wah Cantt</p>
         </div>
       </div>

       
       <div className="flex items-center justify-start gap-4 border-b-2 border-gray-200 py-2">
         <Navigation />
         <div>
           <h2  className="text-lg font-semibold">CB-1225, Muslim Street</h2>
           <p className="text-gray-600 text-md">Ahmad Nagar, Wah Cantt</p>
         </div>
       </div>
       

      
       <div className="flex items-center justify-start gap-4 border-b-2 border-gray-200 py-2">
         <CircleDollarSign /> 
         <div>
           <h2  className="text-lg font-semibold">193.20</h2>
           <p className="text-gray-600 text-md">Cash Cash</p>
         </div>
       </div>
       </div>
     
     <button onClick={()=>{
       navigate("/captain-home")
     }} className="bg-green-600 w-full text-center font-semibold text-white text-lg p-3 rounded-lg">Finish Ride</button>
    
   </div>
 </>
  )
}

export default FinishRide