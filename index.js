const express = require("express");
const socketIO = require("socket.io");
const app = express();
const server = app.listen(3000);
const io = socketIO(server);
const path = require("path");

var users = {};
var name = '';
console.log('Server funcionando...');
app.get('/:name', function(req, res){
    name = req.params.name;
    res.sendFile(path.join(__dirname, "/index.html"));
});


// socket
io.sockets.on("connection", function(socket){
  
    users[socket.id] = name;
    socket.on("nRoom", function(room){
        socket.join(room);
        socket.broadcast.in(room).emit("node new user", users[socket.id] + " new user has joined");
    });

    socket.on("node new message", function(data){
        io.sockets.in("nRoom").emit('node news', users[socket.id] + ": "+ data);
    });

});
