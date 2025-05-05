const app = require('./app');
const http = require('http');
const { initializeSocket } = require('./socket');

const server = http.createServer(app);
const port = process.env.PORT || 3000;

// Initialize Socket.io
initializeSocket(server);

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});