
var app = require('express')();
const bodyParser = require('body-parser');
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
    //===============for chat==========================
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

//==================================================
//==============for drive simulation================
app.use(bodyParser.json());
app.post('/receive-values', (req, res) => {
  // console.log(req.body);
  let values = req.body;
  for (let i = 0; i < values.length; i++) {
      setTimeout(() => {
          io.emit('value', values[i]);
          // console.log(values[i]);
      }, 1000 * i);
  }
  res.send("Values received.");
});



http.listen(3000, () => {
  console.log('listening on *:3000');
});