import {getSocket} from './socket.js';
const socket = getSocket();

/**
 * Fonction permettant de fixer le username au serveur
 */
function setUsername() {
  socket.emit('setUsername', document.getElementById('name').value);
};

// Listener du bouton
document.getElementById('usernameButton').
    addEventListener('click', setUsername);

// Si le user existe, on l'affiche à l'utilisateur
socket.on('userExists', function(data) {
  document.getElementById('messageInfo').innerHTML = data;
});

socket.on('userLeaveRoom', function(data) {
  document.getElementById(data.socketid).remove();
});
