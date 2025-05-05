import React from 'react'
import { CaptainDataContext } from '../context/CaptainContext'
import { Clock, Gauge, NotepadText } from 'lucide-react'

const CaptainDetails = () => {
  const { captain } = React.useContext(CaptainDataContext)
  return (
    <>
         <div className='flex justify-between items-center'>
        <div className='flex items-center gap-4 flex-start'>
        <img className='h-12 w-12 rounded-full object-cover' src="https://i.pinimg.com/564x/47/74/c1/4774c16ed57e7eff960a338e5a57d71d.jpg" alt="" />
        <h4 className='text-2xl font-semibold capitalize'>{captain.fullname.firstname + " " 
        + captain.fullname.lastname}</h4>
        </div>
        <div>
          <h4 className='text-2xl font-semibold'>Rs. 500.20</h4>
          <p className='text-gray-500 text-lg font-medium'>Earned</p>
        </div>
       </div>

       <div className='flex justify-center gap-5 items-center mt-4 text-center bg-gray-200 rounded-lg p-4'>
         <div className='flex flex-col items-center justify-center gap-2'>
         <Clock size={32} className='font-thin'/>
         <h4 className='text-xl font-semibold'>10</h4>
         <p className='text-base font-medium text-gray-500'>Hours Online</p>
         </div>
         <div className='flex flex-col items-center justify-center gap-2'>
         <Gauge size={32} className='text-2xl font-thin' />
         <h4 className='text-xl font-semibold'>50</h4>
         <p className='text-base font-medium text-gray-500'>KM Covered</p>
         </div>
         <div className='flex flex-col items-center justify-center gap-2'>
         <NotepadText size={32} className='text-2xl font-thin'/>
         <h4 className='text-xl font-semibold'>10.2</h4>
         <p className='text-base font-medium text-gray-500'>Hours Online</p>
         </div>
       </div>
    </>
  )
}

export default CaptainDetails