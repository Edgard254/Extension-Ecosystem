const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const extensions = {};

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', (socket) => {
  socket.on('load extensions', () => {
    const extensionFiles = fs.readdirSync(__dirname + '/extensions');
    extensionFiles.forEach((file) => {
      const extensionName = file.split('.')[0];
      extensions[extensionName] = require('./extensions/' + extensionName)(io, socket);
    });
    io.emit('extensions loaded', Object.keys(extensions));
  });

  socket.on('run extension', (extensionName, code) => {
    if (extensions[extensionName]) {
      extensions[extensionName].run(code);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});