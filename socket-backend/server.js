
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http, {
    cors: {
      origin: "http://localhost:4200",
      methods: ["GET", "POST"]
    }
  });

io.on('connection', (socket) => {  
    console.log('a user connected'); 
    // join user's own room
    
    socket.on('message', (msg) => {
        console.log(msg);
        socket.broadcast.emit('message-broadcast', msg);
    });

    socket.on("join", (roomName) => {
        console.log("join: " + roomName);
        socket.join(roomName);
    });

    socket.on('setUserId', (userId) => {
        socket.userId = userId;
    });

    socket.on("private message", ({ content, to }) => {
        console.log("private msg '" + content +"' to: "+to);
        socket.to(to).emit("private message", {
          content,
          userId: socket.userId,
        });
    });

 });

app.get('/', (req, res) => res.send('hello!'));
  http.listen(3000, () => {
  console.log('listening on *:3000');
});