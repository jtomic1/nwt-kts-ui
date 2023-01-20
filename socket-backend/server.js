
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

let cars = {};
let stopSimulation = {};

app.post('/driveSimulation', (req, res) => {
  let data = req.body;
  let values = data['values'];
  let sendObj = { 
    "plateNumber":data['driver'],
  }
  
  stopSimulation[data.driver] = false;
  function sendValue() {
    if( stopSimulation[data.driver] != true){
      if (values.length === 0) {
        clearTimeout(cars[data.driver]);
        delete cars[data.driver];
        stopSimulation[data.driver] = true;
        return;
      }
      sendObj["newPosition"] = values.shift();
      io.emit('newPositionForDriver', sendObj);
      console.log(sendObj);
      console.log(values.length);
      setTimeout(sendValue, 1000);
    }
  }
  cars[data.driver] = setTimeout(sendValue, 1000);
  res.json({ message: "Values received." });
});

app.post('/stopSimulation', (req, res) => {
  let data = req.body;
  console.log(data);
  io.to(data.clientId.toString()).emit('driverStopRide',{});
  console.log("stop simulation "+data.driver);
  stopSimulation[data.driver] = true;
  clearTimeout(cars[data.driver]);
  delete cars[data.driver];
  res.json({ message: "Simulation stopped." });
});

app.post('/driver-change-status', (req, res) => {
  console.log('driver-change-status');
  console.log(req.body);
  let data = req.body;
  // let driverId = data['driverId'];
  // let ride = data['rideDTO'];
  
  io.emit( 'driver-change-status' , {
    driverId: data.driverId ,
    vehiclePlateNumber: data.plateNumber,
    driverStatus : data.driverStatus 
  } );
  res.json({ message: "Driver accepted" });
});
//==============================================
//================for order process ============
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
  
  io.to(ride.clientId.toString()).emit( 'acceptedRide' , {
    ride:ride
  } );
  res.json({ message: "Driver accepted" });
});

app.post('/deniedRide', (req, res) => {
  console.log(req.body);
  let data = req.body;
  let driverId = data['driverId'];
  let ride = data['rideDTO'];
  
  io.to(ride.clientId.toString()).emit( 'deniedRide' , {
    driverId:driverId
  } );
  res.json({ message: "Driver accepted" });
});


app.post('/client-confirmed', (req, res) => {
  console.log('client-confirmed');
  console.log(req.body);
  let data = req.body;
  let driverId = data['driverId'];
  let ride = data['rideDTO'];
  
  io.to(driverId.toString()).emit( 'clientAcceptedRide' , {
    ride:ride
  } );
  res.json({ message: "Driver accepted" });
});

app.post('/client-denied', (req, res) => {
  console.log('client-denied');
  console.log(req.body);
  let data = req.body;
  let driverId = data['driverId'];
  let ride = data['rideDTO'];
  
  io.to(driverId.toString()).emit( 'clientDeniedRide' , {
    ride:ride
  } );
  res.json({ message: "Driver accepted" });
});

//==========================================

http.listen(3000, () => {
  console.log('listening on *:3000');
});