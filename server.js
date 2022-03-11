/* eslint-disable prefer-const */
/* eslint-disable max-len */
'use strict';

const express = require('express');
const bodyParser = require('body-parser');

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
let guesser = true;
io.on('connection', function(socket) {
  console.log('A user connected');
  socket.on('setUsername', function(data) {
    if (users.indexOf(data) == -1) {
      users.push(data);
      if (guesser) {
        socket.emit('guesserSet', {username: data, guesser: true});
        guesser = false;
      } else {
        socket.emit('helperSet', {username: data, guesser: false});
        guesser = true;
      }
    } else {
      socket.emit('userExists', data + ' username is taken! Try some other username.');
    }
  });

  socket.on('msg', function(data) {
    // Send message to everyone
    io.sockets.emit('newmsg', data);
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
