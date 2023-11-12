require('dotenv').config();
const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const { checkDatabaseConnection } = require('./db/');
const cors = require('cors');
const { initializeSocketControllers } = require('./controllers/controllers');

const app = express();
const server = createServer(app);

const io = new Server(server, {
    cors: {
        origins: ["*"],
        handlePreflightRequest: (req, res) => {
            res.writeHead(200, {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST",
                "Access-Contro1-Allow-Headers": "my-custom-header",
                "Access-Control-Allow-Credentials": true
            });
            res.end();
        }
    }
})

app.use(express.json());
app.use(cors());

initializeSocketControllers(io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log('+---------------------------------------+');
    console.log(`Server is running on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
    checkDatabaseConnection();
});