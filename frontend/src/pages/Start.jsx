import React from 'react'
import { Link } from 'react-router-dom'

const Start = () => {
  return (
    <div className='bg-[url(https://images.unsplash.com/photo-1557404763-69708cd8b9ce?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dHJhZmZpYyUyMGxpZ2h0c3xlbnwwfHwwfHx8MA%3D%3D)] bg-cover bg-bottom h-screen w-full flex flex-col justify-between'>
      <img className='w-20 ml-8 mt-8' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="uber" />
      <div className='bg-white py-7 px-4 flex flex-col gap-4'>
        <h1 className='text-3xl font-bold text-center'>Get started with Uber</h1>
        <Link to={'/login'} className='w-full text-center bg-black text-white py-3 rounded-lg cursor-pointer select-none'>Continue</Link>
      </div>
    </div>
  )
}

export default Start