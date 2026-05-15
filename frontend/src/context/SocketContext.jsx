import React, { createContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export const SocketContext = createContext();

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(`${import.meta.env.VITE_BASE_URL}`);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log(`Connected to socket server ${newSocket.id}`);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from socket server');
    });

    // return () => {
    //   newSocket.disconnect();
    // };
  }, []);

  return (
    <SocketContext.Provider value={{socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;