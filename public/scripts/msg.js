
function time() {
  var hora = document.getElementsByClassName('time-right');
  var hora2 = document.getElementsByClassName('time-left');
  var date = new Date();
  for (var i = 0; i < hora.length; i++) {
    hora[i].innerHTML = date.getHours()+':'+date.getMinutes();
  }
  for (var i = 0; i < hora2.length; i++) {
    hora2[i].innerHTML = date.getHours()+':'+date.getMinutes();
  }
}

function enter() {//Si pulsamos enter se envia el mensaje

}

function enviar() {
  // var texto = document.getElementById('nTxt');
  // var chat = document.getElementById('chat');
  // if (texto.value !== '') {
  //   chat.innerHTML += `<div class="container darker">
  //     <img src="/img/user.png" alt="Avatar" style="width:100%;"><u>Nombre</u>
  //     <p>${texto.value}</p>
  //     <span class="time-left" id = 'hora'>11:05</span>
  //   </div>`
  //   texto.value = '';
  // }

}
var fotos;
var cont = 0;
function previewFile(){
    var preview = document.querySelector('img'); //selects the query named img
    var file    = document.querySelector('input[type=file]').files[0]; //sames as here
    var reader  = new FileReader();

    reader.onloadend = function () {
        preview.src = reader.result;
    }
    fotos=file;
    cont++;

    if (file) {
        reader.readAsDataURL(fotos); //reads the data as a URL
    } else {
        preview.src = "";
    }
  sessionStorage.setItem('fotos', fotos);
}
