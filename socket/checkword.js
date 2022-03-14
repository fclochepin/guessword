// Socket gérant la verification du mot proposé par le helper
const Dictionnaire = require('../models/Dictionnary');

const io = require('../server').io;

module.exports = function(socket) {
  socket.on('newword', function(data) {
    // Le helper vient de soumettre un newword
    // Vérifions que le mot existe dans le dictionnaire
    // Verification que le mot est bien présent dans le dictionnaire
    Dictionnaire.find({
      $text: {
        '$search': data.message,
        '$diacriticSensitive': false}}, function(err, reponse) {
      console.log(reponse);
      // Vérifions le nombre de mots trouvés dans le dictionnaire
      let finalWord = '';
      if (reponse.length > 1) {
        if (reponse.find((word) => word.word==data.message)) {
          finalWord = reponse.find((word) => word.word==data.message).word;
        } else {
          reponse.forEach(function(item) {
            if (item.word.length == data.message.length) {
              finalWord = item.word;
            };
          });
        };
      } else {
        if (reponse.length!=0) {
          // Le mot est bien dans le dictionnaire
          finalWord = reponse[0].word;
        }
      }

      if (finalWord == '') {
      // Emit un evenement mot pas trouvé
      } else {
      // Affichage du mot pour le helper
        data.message = finalWord;
        io.to('ROOM').emit('printWord', data);
        // MàJ de l'interface du helper
        io.to(data.userinfos.socketId).emit('wait', data);
        // MàJ de l'interface du guesser
        io.to(data.userinfos.coplayer).emit('send', data);
      }
    });
  });
};

