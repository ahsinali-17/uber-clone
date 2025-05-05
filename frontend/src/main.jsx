import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import UserContext from './context/UserContext.jsx'
import CaptainContext from './context/CaptainContext.jsx'
import App from './App.jsx'
import SocketProvider from './context/SocketContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SocketProvider>
      <CaptainContext>
        <UserContext>
          <App />
        </UserContext>
      </CaptainContext>
    </SocketProvider>
  </StrictMode>,
)
