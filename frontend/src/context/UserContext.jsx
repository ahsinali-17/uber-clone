import React, {useState, createContext } from 'react'

export const UserDataContext = createContext()

const UserContext = ({children}) => {
  const [user, setuser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const updateUser = (userData) => {
    setuser(userData)
}
  
  return (
    <>
        <UserDataContext.Provider value={{user, setuser,loading,error,updateUser,setLoading,setError}}>
        {children}
        </UserDataContext.Provider>
    </>
  )
}

export default UserContext