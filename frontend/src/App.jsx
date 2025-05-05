import React from 'react'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import Home from './pages/Home'
import Start from './pages/Start'
import Userlogin from './pages/Userlogin'
import Usersignup from './pages/UserSignup'
import Captainlogin from './pages/Captainlogin'
import Captainsignup from './pages/Captainsignup'
import UserProtectedPage from './pages/UserProtectedPage'
import CaptainProtectedPage from './pages/CaptainProtectedPage'
import Userlogout from './pages/Userlogout'
import CaptainLogout from './pages/CaptainLogout'
import CaptainHome from './pages/CaptainHome'
import Riding from './pages/Riding'
import CaptainRiding from './pages/CaptainRiding'

const App = () => {

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Start />
    },
    {
      path: '/login',
      element: <Userlogin />
    },
    {
      path: '/signup',
      element: <Usersignup />
    },
    {
      path: '/captain-login',
      element: <Captainlogin />
    },
    {
      path: '/captain-signup',
      element: <Captainsignup />
    },
    {
      path: '/home',
      element:<UserProtectedPage><Home /></UserProtectedPage> 
    },
    {
      path: '/captain-home',
      element:<CaptainProtectedPage><CaptainHome /></CaptainProtectedPage>
    },
    {
      path: '/user-logout',
      element:<UserProtectedPage><Userlogout /></UserProtectedPage>
    },
    {
      path: '/captain-logout',
      element:<CaptainProtectedPage><CaptainLogout /></CaptainProtectedPage>
    },
    {
      path: '/riding',
      element:<UserProtectedPage><Riding /></UserProtectedPage>
    },
    {
      path: '/captain-riding',
      element:<CaptainProtectedPage><CaptainRiding /></CaptainProtectedPage>
    }
  ])
  return (
    <>
    <RouterProvider router={router}/>
    </>
  )
}

export default App