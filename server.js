/* eslint-disable prefer-const */
/* eslint-disable max-len */
'use strict';

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';
const express = require('express');
const mongoose = require('mongoose');
const unitTest = require('./socket/test');

mongoose.connect('mongodb://192.168.10.2:27017/guessword', function(err) {
  if (err) {
    throw err;
  } else {
    console.log('connexion reussie');
  };
});


// App
const app = express();

// eslint-disable-next-line new-cap
const http = require('http').Server(app);
const io = require('socket.io')(http);

module.exports = {
  http: http,
  io: io,
};

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));


// ESPACE DE TEST

// Socket gérant la verification du mot proposé par le helper
const Dictionnaire = require('./models/Dictionnary');

// FIN DES TEST

app.get('/', function(req, res) {
  res.render('home');
});

app.get('/test', function(req, res) {

});

io.on('connection', function(socket) {
  // Dès que la personne entre son nom
  socket.join('ROOM');

  /**
  * Socket gérant la connexion de l'utilisateur
  */
  require('./socket/login')(socket);

  /**
  * Socket gérant la déconnexion de l'utilisateur
  */
  require('./socket/logout')(socket);

  /**
  * Socket gérant la vérification du mot de l'utilisateur
  */
  require('./socket/checkword')(socket);
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
