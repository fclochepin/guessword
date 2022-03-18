/* eslint-disable no-multi-str */
import {getSocket} from './socket.js';
import {getData, setData} from './data.js';

const socket = getSocket();

/**
 * Permet d'envoyer le word saisi par l'utilisateur au serveur
*/
function submitWord() {
  const msg = document.getElementById('message').value;
  if (msg) {
    console.log(getData());
    const newData = getData();
    newData.message = msg;
    setData(newData);
    socket.emit('newword', getData());
  }
}
document.getElementById('send').addEventListener('click', submitWord);

// On cache le bloc permettant d'envoyer un mot
socket.on('wait', function() {
  document.getElementById('blocProposition').style.visibility = 'hidden';
});

// Affichage du bloc permettant d'envoyer un mot
socket.on('send', function() {
  document.getElementById('blocProposition').style.visibility = 'visible';
});

// Affichage du nouveau mot
socket.on('printWord', function(data) {
  const newword = document.createElement('div');
  newword.className = 'col-lg-5';
  newword.innerHTML = data.message;
  document.getElementById('listWord').appendChild(newword);
});

socket.on('wordNotInDictionnary', function() {
  document.getElementById('containerWord').insertBefore(createError('<strong>Erreur</strong> Ce mot ne fait pas partie du dictionnaire :('), document.getElementById('blocProposition'));
});

socket.on('hideWordNDictionnary', function() {
  document.getElementById('messageInfo').innerHTML = '';
});

function createError(message) {
  const div = document.createElement('div');
  const button = document.createElement('button');
  div.innerHTML = message;
  div.className = 'alert alert-danger alert-dismissible fade show';
  button.type = 'button';
  button.className = 'btn-close';
  button.setAttribute('data-bs-dismiss', 'alert');
  div.appendChild(button);
  return div;
};

function createValidate(message) {
  const div = document.createElement('div');
  const button = document.createElement('button');
  div.innerHTML = message;
  div.className = 'alert alert-success alert-dismissible fade show';
  button.type = 'button';
  button.className = 'btn-close';
  button.setAttribute('data-bs-dismiss', 'alert');
  div.appendChild(button);
  return div;
};
