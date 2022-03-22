/* eslint-disable no-multi-str */
import {getSocket} from './socket.js';
import {getData, setData} from './data.js';
import {createValidate} from './words.js';

const socket = getSocket();

// Mise en attente du guesser
socket.on('showWaitingRoom', function(data) {
  document.getElementById('titleLeft').innerHTML =
  'En attente d\'autres joueurs';
  const waitingRoom = document.createElement('div');
  waitingRoom.className = 'row justify-content-center';
  waitingRoom.id = 'waitingRoom';
  document.getElementById('blocLeft')
      .insertBefore(waitingRoom, document.getElementById('setUsername'));
  document.getElementById('setUsername').remove();

  const removeLastUser = data.users.slice(0, -1);
  console.log(removeLastUser);
  if (removeLastUser.length >= 1) {
    removeLastUser.forEach( function(element) {
      const newUser = document.createElement('div');
      newUser.className = 'col-3 col-xl-2';
      newUser.id = element.socketId;
      newUser.innerHTML = element.username;
      document.getElementById('waitingRoom').appendChild(newUser);
    });
  }
});

socket.on('showHost', function(data) {
  console.log('showHost');
  setData(data);
  const button = document.createElement('button');
  button.id = 'startRound';
  button.type = 'button';
  button.innerHTML = 'Lancer la partie';
  button.className = 'btn btn-success';
  document.getElementById('blocLeft').appendChild(button);
  button.addEventListener('click', function() {
    socket.emit('startRound', getData());
  });
});

socket.on('waitHost', function(data) {
  setData(data);
  const msg = document.createElement('p');
  msg.id = 'pWaiting';
  msg.innerHTML = 'En attente du lancement de la partie par l\'hôte ...';
  document.getElementById('blocLeft').appendChild(msg);
});

socket.on('appendUser', function(data) {
  console.log('appendUser');
  // On ajoute le bouton pour démarrer la partie
  const newUser = document.createElement('div');
  newUser.className = 'col-3 col-xl-2';
  newUser.id = data.socketId;
  newUser.innerHTML = data.username;
  document.getElementById('waitingRoom').appendChild(newUser);
});

// Démarrage de la partie côté Helper
socket.on('startGameHelper', function(data) {
  document.getElementById('blocLeft').remove();
  document.getElementById('blocRight').remove();
  const newContainer = document.createElement('div');
  newContainer.id = 'containerWord';
  newContainer.className = 'col-menu col-sm-11';
  document.getElementById('mainRow').appendChild(newContainer);
  const newTitle = document.createElement('h2');
  newTitle.id = 'titleWord';
  newTitle.innerHTML = 'Vous devez faire deviner le mot ' + data.toGuess[data.round].word;
  document.getElementById('containerWord').appendChild(newTitle);

  // Affichage du bloc de propositions
  document.getElementById('containerWord').appendChild(document.getElementById('blocProposition'));
  document.getElementById('blocProposition').style.visibility = 'visible';
  document.getElementById('blocProposition').style.position = 'static';

  // Affichage du tableau de guessword
  document.getElementById('containerWord').appendChild(document.getElementById('headerListWord'));
  document.getElementById('headerListWord').style.visibility = 'visible';
  document.getElementById('headerListWord').style.position = 'static';

  document.getElementById('user2').innerHTML = data.userinfos.coplayername;
  document.getElementById('user1').innerHTML = data.userinfos.username;

  // Affichage du tableau de guessword
  document.getElementById('containerWord').appendChild(document.getElementById('listWord'));
  document.getElementById('listWord').style.visibility = 'visible';
  document.getElementById('listWord').style.position = 'static';

  setData(data);
});

// Démarrage de la partie côté Guesser
socket.on('startGameGuesser', function(data) {
  document.getElementById('blocLeft').remove();
  document.getElementById('blocRight').remove();
  const newContainer = document.createElement('div');
  newContainer.id = 'containerWord';
  newContainer.className = 'col-menu col-sm-11';
  document.getElementById('mainRow').appendChild(newContainer);
  const newTitle = document.createElement('h2');
  newTitle.id = 'titleWord';
  newTitle.innerHTML = data.userinfos.coplayername + ' doit vous faire deviner le mot ';
  document.getElementById('containerWord').appendChild(newTitle);

  // Affichage du bloc de propositions
  document.getElementById('containerWord').appendChild(document.getElementById('blocProposition'));
  document.getElementById('blocProposition').style.position = 'static';

  // Affichage du tableau de guessword
  document.getElementById('containerWord').appendChild(document.getElementById('headerListWord'));
  document.getElementById('headerListWord').style.visibility = 'visible';
  document.getElementById('headerListWord').style.position = 'static';

  document.getElementById('user2').innerHTML = data.userinfos.username;
  document.getElementById('user1').innerHTML = data.userinfos.coplayername;

  // Affichage du tableau de guessword
  document.getElementById('containerWord').appendChild(document.getElementById('listWord'));
  document.getElementById('listWord').style.visibility = 'visible';
  document.getElementById('listWord').style.position = 'static';

  setData(data);
});

socket.on('newRoundHelper', function(data) {
  setData(data);
  document.getElementById('containerWord').insertBefore(createValidate('<strong>Bravo !</strong> Vous avez correctement trouvé le mot, c\'est à votre tour de faire deviner !'), document.getElementById('titleWord'));
  document.getElementById('titleWord').innerHTML = 'Vous devez faire deviner le mot ' + data.toGuess[data.round].word;
  document.getElementById('message').value = '';
  document.getElementById('listWord').innerHTML = '';
  const user2 = document.getElementById('user2').innerHTML;
  document.getElementById('user2').innerHTML = document.getElementById('user1').innerHTML;
  document.getElementById('user1').innerHTML = user2;
  console.log(getData());
});

socket.on('newRoundGuesser', function(data) {
  setData(data);
  document.getElementById('containerWord').insertBefore(createValidate('<strong>Bravo !</strong> Votre partenaire a trouvé le mot, c\'est à votre tour de deviner !'), document.getElementById('titleWord'));
  document.getElementById('titleWord').innerHTML = data.userinfos.coplayername + ' doit vous faire deviner le mot ';
  document.getElementById('listWord').innerHTML = '';
  const user2 = document.getElementById('user2').innerHTML;
  document.getElementById('user2').innerHTML = document.getElementById('user1').innerHTML;
  document.getElementById('user1').innerHTML = user2;
  console.log(getData());
});

socket.on('finpartie', function() {
  document.getElementById('containerWord').innerHTML = 'Bravo, vous avez gagné la partie';
});
