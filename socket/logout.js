
// eslint-disable-next-line prefer-const
let users = require('../shared/users').users;
// eslint-disable-next-line prefer-const
let usersWaiting = require('../shared/users').usersWaiting;

const io = require('../server').io;

module.exports = function(socket) {
  // Socket gérant la deconnexion de l'utilisateur
  socket.on('disconnect', function() {
    // On vide users et usersWaiting
    if (users.some((user) => user.socketId == socket.id)) {
      const indexUser = users.findIndex((user) => user.socketId == socket.id);
      io.to('ROOM').emit('userLeaveRoom',
          {socketid: users[indexUser].socketId});
      users.splice(users.findIndex((user) => user.socketId == socket.id), 1);
    }

    if (usersWaiting.some((user) => user.socketId == socket.id)) {
      usersWaiting.splice(usersWaiting.findIndex(
          (user) => user.socketId == socket.id), 1);
    }
  });
};
