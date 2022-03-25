/* eslint-disable no-multi-str */
import {getSocket} from './socket.js';
import {getData, setData} from './data.js';

const socket = getSocket();

/**
 * Permet d'envoyer le word saisi par l'utilisateur au serveur
*/
function submitWord() {
  document.getElementById('send').disabled = true;
  const msg = document.getElementById('message').value;
  if (msg) {
    console.log(getData());
    const newData = getData();
    newData.message = msg;
    socket.emit('newword', newData);
  }
}
document.getElementById('send').addEventListener('click', submitWord);
document.getElementById('message').addEventListener('keypress', function(event) {
  document.getElementById('send').disabled = false;
  if (event.key == 'Enter') {
    submitWord();
  }
});

// On cache le bloc permettant d'envoyer un mot
socket.on('wait', function() {
  document.getElementById('message').value = '';
  document.getElementById('blocProposition').style.visibility = 'hidden';
  document.getElementById('send').disabled = false;
});

// Affichage du bloc permettant d'envoyer un mot
socket.on('send', function() {
  document.getElementById('message').value = '';
  document.getElementById('blocProposition').style.visibility = 'visible';
  document.getElementById('send').disabled = false;
});

// Affichage du bloc permettant d'envoyer un mot
socket.on('saveData', function(data) {
  console.log(data);
  setData(data);
});

// Affichage du nouveau mot
socket.on('printWord', function(data) {
  const newword = document.createElement('div');
  newword.className = 'col-sm-6';
  newword.innerHTML = data.message;
  document.getElementById('listWord').appendChild(newword);
});

socket.on('wordNotInDictionnary', function() {
  document.getElementById('send').disabled = false;
  document.getElementById('containerWord').insertBefore(createError('<strong>Erreur</strong> Ce mot ne fait pas partie du dictionnaire :('), document.getElementById('blocProposition'));
});

socket.on('hideWordNDictionnary', function() {
  document.getElementById('messageInfo').innerHTML = '';
});

export function createError(message) {
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

export function createValidate(message) {
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

