const Words = require('../models/Words');

const users = require('../shared/users').users;
const usersWaiting = require('../shared/users').usersWaiting;
const rooms = require('../shared/users').rooms;

const io = require('../server').io;

module.exports = function(socket) {
  // Socket gérant la connexion de l'utilisateur
  socket.on('startRound', function(data) {
    console.log('Début du round !');
    if (usersWaiting.length <= 1) {
      // Pas assez de joueur pour démarrer la partie
    } else {
      // On va tirer des duos pour démarrer la partie
      let tabSocketId = [];
      users.forEach(function(item) {
        tabSocketId.push(item.socketId);
      });

      tabSocketId = tabSocketId.sort();
      if (tabSocketId.length%2==1) {
        tabSocketId.splice(0, 1);
      }
      for (let i = 0; i < tabSocketId.length; i+=2) {
        const today = new Date();
        const newRoom = String(i) + String(today.getTime());
        const user = users.find((user) => user.socketId==tabSocketId[i]);
        const coplayer = users.find((user) => user.socketId==tabSocketId[i+1]);
        const room = {roomId: newRoom, nbRound: 2, round: 0, points: 0};
        rooms.push(room);

        user.room = newRoom;
        coplayer.room = newRoom;
        user.guesser = true;
        coplayer.guesser = false;
        user.coplayer = tabSocketId[i+1];
        coplayer.coplayer = tabSocketId[i];
        user.coplayername = coplayer.username;
        coplayer.coplayername = user.username;

        Words.count(function(err, reponse) {
          if (err) {
            throw err;
          } else {
            const R = Math.random() * reponse;
            Words.find(function(err, reponse) {
            // Pour le helper
              console.log('send to helper');
              // Pour le guesser
              io.to(user.socketId).emit('startGameGuesser', {
                toGuess: reponse,
                userinfos: user,
                round: 0});
              io.to(coplayer.socketId).emit('startGameHelper', {
                toGuess: reponse,
                userinfos: coplayer,
                round: 0});
            }).limit(4).skip(R);
            console.log(users);
          }
        });
      }
    }
  });
};
