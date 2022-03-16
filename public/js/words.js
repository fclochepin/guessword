import {getSocket} from './socket.js';
import {getData, setData} from './data.js';

const socket = getSocket();

/**
 * Permet d'envoyer le word saisi par l'utilisateur au serveur
*/
function submitWord() {
  const msg = document.getElementById('message').value;
  if (msg) {
    const newData = getData();
    newData.message = msg;
    setData(newData);
    socket.emit('newword', getData());
  }
}
document.getElementById('send').addEventListener('click', submitWord);

// On cache le bloc permettant d'envoyer un mot
socket.on('wait', function(data) {
  document.getElementById('blocProposition').style.visibility = 'hidden';
});

// Affichage du bloc permettant d'envoyer un mot
socket.on('send', function(data) {
  document.getElementById('blocProposition').style.visibility = 'visible';
});

// Affichage du nouveau mot
socket.on('printWord', function(data) {
  console.log('On print word');
  const newword = document.createElement('div');
  newword.className = 'col-lg-5';
  newword.innerHTML = data.message;
  document.getElementById('listWord').appendChild(newword);
});
