/* eslint-disable prefer-const */
/* eslint-disable max-len */
'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Words = require('./models/Words');


mongoose.connect('mongodb://192.168.10.2:27017/guessword', function(err) {
  if (err) {
    throw err;
  } else {
    console.log('connexion reussie');
  };
});

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true})); // Specifying to use urlencoded

app.get('/', function(req, res) {
  res.render('home');
});

// eslint-disable-next-line prefer-const
let users = [];
let usersWaiting = [];
let guesser = true;
io.on('connection', function(socket) {
  // Dès que la personne entre son nom
  socket.join('ROOM');
  socket.on('setUsername', function(data) {
    // Si son nom est validé
    if (!users.some((user) => user.username ===data)) {
      // On vérifie si une personne est disponible pour jouer
      if (usersWaiting.length >=1) {
        // On récupère le joueur en attente
        let coplayer = usersWaiting[0];
        coplayer = users.find((user) => user.socketId === coplayer.socketId);
        // Mise à jour du socketId du coplayer
        coplayer.coplayer = socket.id;
        // Push du new user
        users.push({username: data, socketId: socket.id, guesser: !coplayer.guesser, coplayer: coplayer.socketId});
        usersWaiting.splice(coplayer);
        // Emit les événements pour démarrer la partie
        // Selection d'un mot aléatoire dans la base de données
        Words.count(function(err, reponse) {
          if (err) {
            throw err;
          } else {
            let R = Math.random() * reponse;
            Words.find(function(err, reponse) {
            // Pour le helper
              io.to(socket.id).emit('startGameHelper', {word: reponse, users: users.find((user) => user.socketId === socket.id)});
              // Pour le guesser
              io.to(coplayer.socketId).emit('startGameGuesser', users.find((user) => user.socketId === coplayer.socketId));
            }).limit(1).skip(R);
          }
        });
      } else {
        // On se met en attente d'un autre joueur
        socket.emit('helperWaitGuesser', {username: data, guesser: false});
        users.push({username: data, socketId: socket.id, guesser: false});
        usersWaiting.push({username: data, socketId: socket.id, guesser: false});
      }
    } else {
      socket.emit('userExists', data + ' username is taken! Try some other username.');
    }
  });

  socket.on('disconnect', function() {
    // On vide users et usersWaiting
    if (users.some((user) => user.socketId == socket.id)) {
      users.splice(users.find((user) => user.socketId === socket.id));
    }

    if (usersWaiting.some((user) => user.socketId == socket.id)) {
      usersWaiting.splice(usersWaiting.find((user) => user.socketId === socket.id));
    }
  });

  socket.on('newword', function(data) {
    // Le helper vient de soumettre un newword
    // Data = informations du helper
    console.log(data);
    // Affichage du mot pour le helper
    io.to('ROOM').emit('printWord', data);
    // MàJ de l'interface du helper
    io.to(data.userinfos.socketId).emit('wait', data);
    // MàJ de l'interface du guesser
    io.to(data.userinfos.coplayer).emit('send', data);
  });
});

// Listening on Host and Port
http.listen(PORT, HOST, () => console.log(`Listening on http://${HOST}:${PORT}/`));

process.once('SIGUSR2', function() {
  process.kill(process.pid, 'SIGUSR2');
});

process.on('SIGINT', function() {
  // this is only called on ctrl+c, not restart
  process.kill(process.pid, 'SIGINT');
});
