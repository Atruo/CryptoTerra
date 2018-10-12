
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
