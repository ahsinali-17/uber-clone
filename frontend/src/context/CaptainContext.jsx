import React, {useState, createContext } from 'react'

export const CaptainDataContext = createContext()

const CaptainContext = ({children}) => {
  const [captain, setcaptain] = useState(null)
  const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const updateCaptain = (captainData) => {
        setcaptain(captainData)
    }

  return (
    <>
        <CaptainDataContext.Provider value={{captain, setcaptain,loading,error,updateCaptain,setLoading,setError}}>
        {children}
        </CaptainDataContext.Provider>
    </>
  )
}

export default CaptainContext