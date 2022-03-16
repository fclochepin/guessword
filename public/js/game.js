/* eslint-disable no-multi-str */
import {getSocket} from './socket.js';
import {setData} from './data.js';
const socket = getSocket();

// Mise en attente du guesser
socket.on('helperWaitGuesser', function(data) {
  const waiting = document.createElement('div');
  waiting.innerHTML = 'En attente d\'un partenaire pour jouer ...';
  waiting.id = 'waiting';
  document.getElementById('mainContainer')
      .insertBefore(waiting, document.getElementById('login'));
  document.getElementById('login').remove();
});

// Démarrage de la partie côté Helper
socket.on('startGameHelper', function(data) {
  setData(data);
  document.getElementById('guessWord')
      .innerHTML = 'Vous devez faire deviner le mot : ' + data.toGuess;
  document.getElementById('headerListWord').style.visibility = 'visible';
  document.getElementById('listWord').style.visibility = 'visible';
  document.getElementById('guessWord').style.visibility = 'visible';
  document.getElementById('blocProposition').style.visibility = 'visible';
});

// Démarrage de la partie côté Guesser
socket.on('startGameGuesser', function(data) {
  setData(data);
  document.getElementById('waiting')
      .innerHTML = 'Démarrage du jeu, \
      votre partenaire va faire une proposition ...';
  document.getElementById('headerListWord').style.visibility = 'visible';
  document.getElementById('listWord').style.visibility = 'visible';
  document.getElementById('guessWord').style.visibility = 'hidden';
  document.getElementById('blocProposition').style.visibility = 'hidden';
});

socket.on('newRoundHelper', function(data) {
  console.log(data);
});

socket.on('newRoundGuesser', function(data) {
  console.log(data);
});
