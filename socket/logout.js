
// eslint-disable-next-line prefer-const
let users = require('../shared/users').users;
// eslint-disable-next-line prefer-const
let usersWaiting = require('../shared/users').usersWaiting;

module.exports = function(socket) {
  // Socket gérant la deconnexion de l'utilisateur
  socket.on('disconnect', function() {
    console.log(users.find((user) => user.socketId == socket.id));

    // On vide users et usersWaiting
    if (users.some((user) => user.socketId == socket.id)) {
      users.splice(users.findIndex((user) => user.socketId == socket.id), 1);
      // users.splice(users.find((user) => user.socketId == socket.id));
    }

    if (usersWaiting.some((user) => user.socketId == socket.id)) {
      usersWaiting.splice(usersWaiting.findIndex(
          (user) => user.socketId == socket.id), 1);
    }
  });
};
