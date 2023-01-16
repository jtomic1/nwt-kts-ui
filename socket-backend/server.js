
var app = require('express')();
const cors = require('cors');
const bodyParser = require('body-parser');
var http = require('http').createServer(app);
var io = require('socket.io')(http, {
    cors: {
      origin: "http://localhost:4200",
      methods: ["GET", "POST"]
    }
  });

app.use(cors({ origin: 'http://localhost:4200' }));

io.on('connection', (socket) => {  
    console.log('a user connected'); 
    // join user's own room
    //===============for chat==========================
    socket.on('message', (msg) => {
        console.log(msg);
        socket.broadcast.emit('message-broadcast', msg);
    });

    socket.on("join", (roomName) => {
        if(roomName != null){
          roomName = roomName.toString();
          console.log("join: " + roomName);
          socket.join(roomName);
        }
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

app.post('/driveSimulation', (req, res) => {
  console.log(req.body);
  let data = req.body;
  let values = data['values'];
  let sendObj = { 
    "plateNumber":data['driver'],
  }
  for (let i = 0; i < values.length; i++) {
      setTimeout(() => {
          sendObj["newPosition"] = values[i];
          io.emit('newPositionForDriver', sendObj);
          console.log(sendObj);
      }, 1000 * i);
  }
  res.json({ message: "Values received." });
});


app.post('/notify-driver', (req, res) => {
  console.log(req.body);
  let data = req.body;
  let driverId = data['driverId'];
  let ride = data['rideDTO'];
  
  io.to(driverId).emit( 'newRideRequest' , {
    ride:ride
  } )
  res.json({ message: "Driver notyfied" });
});



app.post('/driver-accepted', (req, res) => {
  console.log(req.body);
  let data = req.body;
  let driverId = data['driverId'];
  let ride = data['rideDTO'];
  
  io.to(ride.rideId.toString()).emit( 'acceptedRide' , {
    ride:ride
  } )
  res.json({ message: "Driver accepted" });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});