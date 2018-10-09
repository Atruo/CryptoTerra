const express = require("express");
const socketIO = require("socket.io");
const app = express();
const server = app.listen(3000);
const io = socketIO(server);
const path = require("path");

var users = {};
var usuarios = [];
var cont = 0;
var name = '';
console.log('Server funcionando...');
console.log('Para ejecutar el link remoto hacer: ./(la barra hacia el otro lado)ngrok http 3000');
app.get('/', function(req,res){//Primero mandamos el HTML para poner el usuario
  res.sendFile(path.join(__dirname, "/index2.html"));
})
app.get('/:name', function(req, res){//Una vez tenemos un usuario mandamos el chat
    name = req.params.name;
    res.sendFile(path.join(__dirname, "/index.html"));
});


// socket
io.sockets.on("connection", function(socket){//Conectamos el socket

    users[socket.id] = name;//Array de usuarios
    socket.on("nRoom", function(room){
        socket.join(room);
        socket.broadcast.in(room).emit("node new user", "Se acaba de unir al chat: "+ users[socket.id]);//Nuevo usuarios
        if (users[socket.id] != '') {
          usuarios[cont] = users[socket.id];
          io.sockets.in("nRoom").emit('actualizar usuarios', usuarios);
          cont++;
        }

    });

    socket.on("node new message", function(data){//Si recibe un nuevo mensaje
        io.sockets.in("nRoom").emit('node news', users[socket.id] + ": "+ data);
    });


});
