const express = require("express");
const socketIO = require("socket.io");
const app = express();
const server = app.listen(3000);
const io = socketIO(server);
const path = require("path");
var formidable = require('formidable');
var fs = require('fs');


var users = {};
var usuarios = [];
var cont = 0;
var name = '';
console.log('Para ejecutar el link remoto hacer: ./(la barra hacia el otro lado)ngrok http 3000');
console.log('Server funcionando...');

app.get('/', function(req,res){//Primero mandamos el HTML para poner el usuario
  res.sendFile(path.join(__dirname, "/index2.html"));
})
app.get('/:name', function(req, res){//Una vez tenemos un usuario mandamos el chat
    name = req.params.name;
    res.sendFile(path.join(__dirname, "/chat.html"));
});
app.post('/fileupload', function(req,res){
  console.log('entro');
  var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      console.log(fields.usuario);
      var oldpath = files.filetoupload.path;
      var newpath = path.join(__dirname +'/public/archivos/')+fields.usuario+'.'+files.filetoupload.name.split('.')[1];
      fs.rename(oldpath, newpath, function (err) {
        if (err) throw err;
        var url = '/'+fields.usuario;
        res.redirect(url);
      });


    });
})
app.use(express.static(path.join(__dirname +'/public')));//PARA CREAR UNA CARPETA DE ARCHIVOS PÚBLICOS PARA LAS PETICIONES


// socket
io.sockets.on("connection", function(socket){//Conectamos el socket

    users[socket.id] = name;//Array de usuarios
    socket.on("nRoom", function(room){
        socket.join(room);
        socket.broadcast.in(room).emit("node new user", "Se acaba de unir al chat: "+ users[socket.id]);//Nuevo usuarios

        if (users[socket.id] != '') {
          if (cont === 0) {//Primer Usuario
            console.log('primero');
            io.sockets.in("nRoom").emit('primero', '');
          }
          usuarios[cont] = users[socket.id];
          io.sockets.in("nRoom").emit('actualizar usuarios', usuarios);
          cont++;
        }

    });

    socket.on("node new message", function(data){//Si recibe un nuevo mensaje
        var datos = [users[socket.id],data]
        io.sockets.in("nRoom").emit('node news', datos);
    });
    socket.on("clave_publica", function(data){//Recibimos la clave publica
          io.sockets.in("nRoom").emit('emision_clavePublica', data);
          console.log('el server emite la clave publica');

    });
    socket.on("clave_AES_encriptada", function(data){//Recibimos la clave AES encriptada
      console.log('el server recive la clave aes encriptada');
          io.sockets.in("nRoom").emit('clave_descifrar_AES', data);
    });
    socket.on("send archivo", function(data){//Recibimos el archivo
      console.log('el server recibe el archivo');
          io.sockets.in("nRoom").emit('emision archivo', data);
    });

});
