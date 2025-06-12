import React from 'react'
import {Link} from 'react-router-dom'
import { ArrowLeftFromLine } from 'lucide-react'
import { ChevronUp } from 'lucide-react';
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useState, useRef } from 'react'
import FinishRide from '../components/FinishRide';
import { useLocation } from 'react-router-dom';

const CaptainRiding = () => {
     const [finishRidePanel, setFinishRidePanel] = useState(false);
     const location = useLocation();
     const ride = location.state?.ride;

    const finishRideRef = useRef(null);

    useGSAP(() => {
        if (finishRidePanel) {
          gsap.to(finishRideRef.current, {
            transform: "translateY(0)",
            opacity: 1,
          });
        } else{
          gsap.to(finishRideRef.current, {
            transform: "translateY(100%)",
            opacity: 0,
          });
        }
      },[finishRidePanel])
    
  return (
    <div className="h-screen w-screen overflow-hidden relative">
    <div className='fixed top-0 left-0 w-full flex items-center justify-between p-4 z-10'>
    <img
        className="w-20"
        src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
        alt="uber"
      />
       <Link
      to="/captain-home"
      className="w-11 h-12 rounded-full bg-black flex items-center justify-center"
    >
      <ArrowLeftFromLine className="text-white" />
    </Link>
    </div>
   
    <div className="h-5/6 w-full">
      <img
        className="h-full w-full object-cover object-right"
        src="https://www.medianama.com/wp-content/uploads/2018/06/Screenshot_20180619-112715.png.png"
        alt="map"
      />
    </div>

    <div onClick={()=>{setFinishRidePanel(true)}} className="h-1/6 w-full px-4 box-border p-2 bg-yellow-400 rounded-t-lg">
    <ChevronUp className='mx-auto mt-1 mb-4' />
    <div className='flex justify-between items-center gap-6 '>
       <h4 className='text-2xl font-semibold'>4 KM away</h4>
       <button onClick={()=>{
     }} className="bg-green-500 text-center font-semibold text-white text-lg py-4 px-8 rounded-lg">Complete Ride</button>
     </div>
  </div>

  {/*Finish Ride Popup*/}
  <div ref={finishRideRef} className="fixed h-[70%] bottom-0 z-10 bg-white w-full p-3 rounded-t-3xl">
       <FinishRide setFinishRidePanel={setFinishRidePanel} ride={ride} />
      </div>
  </div>
  )
}

export default CaptainRiding