const express = require("express");
const socketIO = require("socket.io");
const app = express();
const server = app.listen(3000);
const io = socketIO(server);
const path = require("path");

var CryptoJS = require("crypto-js");
var ciphertext = CryptoJS.AES.encrypt('my message', 'secret key 123').toString();

var forge = require('node-forge');
var rsa = forge.pki.rsa;
var keypair = rsa.generateKeyPair({bits: 2048, e: 0x10001});
var txt = 'hola'
var encrypted = keypair.publicKey.encrypt(txt);
// decrypt 
var decrypted = keypair.privateKey.decrypt(encrypted);






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


});
