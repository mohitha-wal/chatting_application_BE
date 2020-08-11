
const { addUser, removeUser, getUser, getUsersInRoom } = require('../controllers/users');
// const app = express()
// const http = require('http');
//  const express = require('express');

// const server = http.createServer(app)
// const io = require('socket.io').listen(server)
module.exports=function(io){
  io.on('connect', async (socket) => {
  socket.on('join', async ({ name, room }, callback) => {
    const  user  = await addUser({ id: socket.id, name, room });

    //if(error) return callback(error);
   // console.log(user)
    socket.join(user.roomName);

    socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${user.roomName}.`});
    socket.broadcast.to(user.roomName).emit('message', { user: 'admin', text: `${user.name} has joined!` });

    io.to(user.roomName).emit('roomData', { room: user.roomName, users: await getUsersInRoom(user.roomName) });

    callback();
  });

  socket.on('sendMessage',async (message, callback) => {

    const user =await getUser(socket.id);

    io.to(user.roomDetails.roomName).emit('message', { user: user.name, text: message });

    callback();
  });

  socket.on('disconnect', async() => {
    const user = await removeUser(socket.id);
    //console.log(user)

    if(user) {
      io.to(user.roomDetails.roomName).emit('message', { user: 'Admin', text: `${user.name} has left.` });
      io.to(user.roomDetails.roomName).emit('roomData', { room: user.room, users:await getUsersInRoom(user.roomDetails.roomName)});
    }
  })
});
}

//module.exports=app