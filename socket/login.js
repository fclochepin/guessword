const users = require('../shared/users').users;
const usersWaiting = require('../shared/users').usersWaiting;

const io = require('../server').io;

module.exports = function(socket) {
  // Socket gérant la connexion de l'utilisateur
  socket.on('setUsername', function(data) {
    socket.join('ROOM');
    // Si son nom est validé
    if (!users.some((user) => user.username ===data)) {
      if (usersWaiting.length == 0) {
        console.log('emit showHost');
        io.to(socket.id).emit('showHost', {
          username: data,
          socketId: socket.id});
      } else {
        io.to(socket.id).emit('waitHost', {
          username: data,
          socketId: socket.id});
      }
      users.push({username: data, socketId: socket.id, guesser: undefined});
      usersWaiting.push({
        username: data,
        socketId: socket.id,
        guesser: undefined});
      // On met le joueur en attente dans la room jusquau démarrage de la partie
      io.to(socket.id).emit('showWaitingRoom', {username: data,
        users: usersWaiting});
      // On append le joueur pour les autres joueurs
      io.to('ROOM').emit('appendUser', {username: data,
        socketId: socket.id,
        guesser: undefined});
    } else {
      socket.emit(
          'userExists',
          data + ' username is taken! Try some other username.');
    }
  });
};
