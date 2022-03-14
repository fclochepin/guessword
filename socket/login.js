const Words = require('../models/Words');

const users = require('../shared/users').users;
const usersWaiting = require('../shared/users').usersWaiting;

const io = require('../server').io;

module.exports = function(socket) {
  // Socket gérant la connexion de l'utilisateur
  socket.on('setUsername', function(data) {
    // Si son nom est validé
    if (!users.some((user) => user.username ===data)) {
    // On vérifie si une personne est disponible pour jouer
      if (usersWaiting.length >=1) {
        console.log('Un joueur est en attente, on le rejoint');
        // On récupère le joueur en attente
        let coplayer = usersWaiting[0];
        coplayer = users.find((user) => user.socketId === coplayer.socketId);
        // Mise à jour du socketId du coplayer
        coplayer.coplayer = socket.id;
        // Push du new user
        users.push({
          username: data,
          socketId: socket.id,
          guesser: !coplayer.guesser,
          coplayer: coplayer.socketId});
        usersWaiting.splice(coplayer);
        console.log(usersWaiting);
        // Emit les événements pour démarrer la partie
        // Selection d'un mot aléatoire dans la base de données
        Words.count(function(err, reponse) {
          if (err) {
            throw err;
          } else {
            const R = Math.random() * reponse;
            Words.find(function(err, reponse) {
            // Pour le helper
              console.log('send to helper');
              io.to(socket.id).emit('startGameHelper', {
                word: reponse,
                user: users.find((user) => user.socketId === socket.id)});
              // Pour le guesser
              io.to(coplayer.socketId).emit('startGameGuesser', {
                word: reponse,
                user: users.find(
                    (user) => user.socketId === coplayer.socketId)});
            }).limit(1).skip(R);
          }
        });
      } else {
      // On se met en attente d'un autre joueur
        socket.emit('helperWaitGuesser', {username: data, guesser: false});
        users.push({username: data, socketId: socket.id, guesser: false});
        usersWaiting.push({
          username: data,
          socketId: socket.id,
          guesser: false});
        console.log(usersWaiting);
      }
    } else {
      socket.emit(
          'userExists',
          data + ' username is taken! Try some other username.');
    }
  });
};
