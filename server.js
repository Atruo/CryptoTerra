const express = require("express");
const socketIO = require("socket.io");
const app = express();
const server = app.listen(3000);
const io = socketIO(server);
const path = require("path");
var formidable = require('formidable');
var fs = require('fs');
var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./public/perfil');
  localStorage.setItem('fotos','[]');
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
      var newpath = path.join(__dirname +'/public/perfil/')+fields.usuario+'.'+files.filetoupload.name.split('.')[1];
      fs.rename(oldpath, newpath, function (err) {
        if (err) throw err;
        var url = '/'+fields.usuario;
        var fotos = JSON.parse(localStorage.getItem('fotos'));
        fotos.push(fields.usuario+'.'+files.filetoupload.name.split('.')[1]);
        localStorage.setItem('fotos',JSON.stringify(fotos));
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


        if (users[socket.id] != '') {
          if (cont === 0) {//Primer Usuario
            console.log('primero');
            var primi = JSON.parse(localStorage.getItem('fotos'));
            io.sockets.in("nRoom").emit('primero', primi[0].split('.')[0]);
          }
          var existe = false;
          for (var i = 0; i < usuarios.length; i++) {
            if (usuarios[i] === name) {
              existe = true;
              console.log(existe);///EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE
            }
          }
          if (existe === false) {
            usuarios[cont] = users[socket.id];
            io.sockets.in("nRoom").emit('actualizar usuarios', usuarios);
            socket.broadcast.in(room).emit("node new user", "Se acaba de unir al chat: "+ users[socket.id]);//Nuevo usuarios
            cont++;
          }

        }
        console.log(usuarios);

    });

    socket.on('disconnect', function () {
      console.log('Desconectado');
      if (socket.id === usuarios[0]) {
        if (usuarios.length > 1) {
          var primi = JSON.parse(localStorage.getItem('fotos'));
            var nuevo = [];
            for (var i = 0; i < primi.length-1; i++) {
              nuevo[i]= primi[i+1]
            }
            console.log(nuevo[0].split('.')[0]);
            io.sockets.in("nRoom").emit('primero', nuevo[0].split('.')[0]);
            localStorage.setItem('fotos', nuevo);
        }
      }
    });
    socket.on("pedir_fotos", function(data){//Peticion de fotos

        io.sockets.in("nRoom2").emit('recibir_fotos', JSON.parse(localStorage.getItem('fotos')));
        console.log(localStorage.getItem('fotos'));
    });

    socket.on("node new message", function(data){//Si recibe un nuevo mensaje
        var datos = [users[socket.id],data,JSON.parse(localStorage.getItem('fotos'))]
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
