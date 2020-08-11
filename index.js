const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./controllers/users');
const {getId , addMessage} = require('./controllers/messages')
const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
app.use(bodyParser.json());
app.use(cors());
app.use('/',router);
var roomName = ''

  io.on('connect',  (socket) => {
  socket.on('join', async ({ name, room }, callback) => {
    const  user  = await addUser({ id: socket.id, name });
    //if(error) return callback(error);
    console.log(room)
    //roomName = room
   // console.log(roomName)
    socket.join(room);
  
    // socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${room}.`});
    // socket.broadcast.to(room).emit('message', { user: 'admin', text: `${user.name} has joined!` });

    io.to(room).emit('roomData', { room: room, users: '' });
    

    callback();
  });

  socket.on('sendMessage',async ({message,room}, callback) => {

    const user =await getUser(socket.id);
    let roomDetails =await getId(room)
    console.log(roomDetails)
    await addMessage(user.id,roomDetails.id,message)
    io.to(room).emit('message', { user: user.name, text: message });

    callback();
  });
  //io.to(room).emit('message', { user: user.name, text: message });
  socket.on('disconnect', async() => {
    //const user = await removeUser(socket.id);
    // console.log(user)

    // if(user) {
    //   io.to(user.roomDetails.roomName).emit('message', { user: 'Admin', text: `${user.name} has left.` });
    //   io.to(user.roomDetails.roomName).emit('roomData', { room: user.room, users:await getUsersInRoom(user.roomDetails.roomName)});
    // }
  })
});

server.listen(process.env.PORT || 8000, () => console.log(`Server has started.`));
module.exports=server
// const express = require('express');
// const bodyParser = require('body-parser');

// const app = express(); // initialize an app
// const routes = require('./router');
// const cors= require('cors')
// const http = require('http');
// //const express = require('express');
// const server = http.createServer(app)
// const io = require('socket.io').listen(server)
// const socket=require('./controllers/socket');
// // var app = require('http').createServer()
// // var io = module.exports.io = require('socket.io')(app)
// const port = 8000;
// app.use(bodyParser.json()); // parse json

// app.use(cors())
// app.use('/', routes);

// io.on('connection', socket)
// app.use((error, req, res, next) => {
//     res.json({
//         success: false,
//         error
//     })
// });

// app.listen(port, (error) => {
//     if (error) {
//         console.log(error);
//     } else {
//         console.log(`Server started on port ${port}`);
//     }
// })
// module.exports=app
// const http = require('http');
// const express = require('express');
// const socketio = require('socket.io');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const { addUser, removeUser, getUser, getUsersInRoom } = require('./controllers/users');

// const router = require('./router');

// const app = express();
// const server = http.createServer(app);
// const io = socketio(server);
// app.use(bodyParser.json());
// app.use(cors());
// app.use('/',router);


//   io.on('connect', async (socket) => {
//   socket.on('join', async ({ name }, callback) => {
//     const  user  = await addUser({ id: socket.id, name });

//     //if(error) return callback(error);
//     console.log(user)
//     //socket.join(user.roomName);

//     socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room .`});
//     socket.broadcast.emit('message', { user: 'admin', text: `${user.name} has joined!` });

//     io.emit('roomData', { users: await getUsersInRoom() });
//     socket.emit('token',{token:`${user.token}`})

//     callback();
//   });

//   socket.on('sendMessage',async (message, callback) => {

//     const user =await getUser(socket.id);

//     io.emit('message', { user: user.name, text: message });

//     callback();
//   });

//   socket.on('disconnect', async() => {
//     //const user = await removeUser(socket.id);
//     // console.log(user)

//     // if(user) {
//     //   io.to(user.roomDetails.roomName).emit('message', { user: 'Admin', text: `${user.name} has left.` });
//     //   io.to(user.roomDetails.roomName).emit('roomData', { room: user.room, users:await getUsersInRoom(user.roomDetails.roomName)});
//     // }
//   })
// });

// server.listen(process.env.PORT || 8000, () => console.log(`Server has started.`));
// module.exports=server