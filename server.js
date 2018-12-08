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
var last_socket ='';
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
      if (users[last_socket] != name) {
        users[socket.id] = name;//Array de usuarios
      }else {
        users[socket.id] = '';
      }
      last_socket = socket.id;


    socket.on("nRoom", function(room){ //Nuevo usuario se conecta al chat
      if (room === 'nRoom') {// Si se conecta en el canal exacto del chat
        socket.join(room);// Dejamos que acceda al canal de comunicación
        if (users[socket.id] != '') {//Si el usuario es válido
          console.log(socket.id);
          if (cont === 0) {//En caso de ser el Primer Usuario(ANFITRION)
            console.log('primero');
            console.log(cont);
            var primi = JSON.parse(localStorage.getItem('fotos'));
            io.sockets.in("nRoom").emit('primero', primi[0].split('.')[0]);
          }
            usuarios[cont] = users[socket.id];//Almacenamos el usuario en un array
            io.sockets.in("nRoom").emit('actualizar usuarios', usuarios);//Emitimos el nuevo usuario al chat
            socket.broadcast.in(room).emit("node new user", "Se acaba de unir al chat: "+ users[socket.id]);//Nuevo usuarios
            cont++;

        }
      }
    });
///////////////////////////////////////////////////////el array de usuarios ahora almacena un array con nombre y socket, muchas cosas no deberias de ir bien ahora
    socket.on('disconnect', function () {//usuario desconectado
      console.log('Desconectado: '+socket.id+' nombre: '+users[socket.id]);


      if (users[socket.id] != '') {//usuario válido
        if (users[socket.id] === usuarios[0]) {//usuario ANFITRION
          if (usuarios.length > 1) {//hay más usuarios conectados
            var nuevo = [];
            var pos;
            for (var i = 1; i < usuarios.length; i++) {//reordenamos el array de usuarios
              if (usuarios[i]!=null) {
                nuevo.push(usuarios[i]);
              }
            }

            usuarios = nuevo;
              console.log(usuarios);
              io.sockets.in("nRoom").emit('primero', nuevo[0]);//emitimos al nuevo ANFITRION
              io.sockets.in("nRoom").emit('actualizar usuarios', usuarios);
              users[socket.id] = '';
              cont--;

          }else {
            cont = 0;
          }
        }else {
          if (usuarios.length > 1) {

            var nuevo = [];
            var pos;
            for (var i = 0; i < usuarios.length; i++) {
              if (usuarios[i] == users[socket.id]) {

              }else {
                nuevo.push(usuarios[i]);
              }
            }
            usuarios = '';
            usuarios = nuevo;
            users[socket.id] = '';
            io.sockets.in("nRoom").emit('actualizar usuarios', usuarios);
            cont--;
          }
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

function remove(array, element) { //Removing elements from array
  return array.filter(e => e !== element);
}

function reajustar(){

}
