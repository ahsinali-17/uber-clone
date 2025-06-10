const { Server } = require("socket.io");
const User = require('./models/user.model');
const Captain = require("./models/captain.model"); // Adjust the path as necessary

let io;

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*", // Allow all origins, modify as needed for security
      methods: ["GET", "POST"],
    },
  });
  
  io.on("connection", (socket) => {
    console.log(`New client connected: ${socket.id}`);

    socket.on("join", async ({userId, userType}) => {
        try {
            if (userType === "user") {
             await User.findByIdAndUpdate(userId, { socketId: socket.id });
            } else if (userType === "captain") {
                await Captain.findByIdAndUpdate(userId, { socketId: socket.id });
            }   
        }catch (error) {
            console.error("Error updating socket ID:", error);
        }
    })

    socket.on("get-captain-location", async ({ captainId, location }) => {
        if(!location || !location.ltd || !location.lng) {
            console.error("Invalid location data:", location);
            return;
        }

        await Captain.findByIdAndUpdate(captainId, { location: { lng:location.lng, ltd:location.ltd} });

    })

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  console.log("Socket.io initialized");
};

const sendMsgToSocketId = (msg, socketId) => {
  if (!io) {
    throw new Error("Socket.io is not initialized. Call initializeSocket first.");
  }
   if(io) {
    io.to(socketId).emit(msg.event, msg.data);
   }
 
};

module.exports = { initializeSocket, sendMsgToSocketId };