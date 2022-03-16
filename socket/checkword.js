// Socket gérant la verification du mot proposé par le helper
const Dictionnaire = require('../models/Dictionnary');
const compareTwoWords = require('../shared/compareTwoWords');

const io = require('../server').io;

module.exports = function(socket) {
  socket.on('newword', function(data) {
    // Le helper vient de soumettre un newword
    // Vérifions que le mot existe dans le dictionnaire
    // Verification que le mot est bien présent dans le dictionnaire
    data.message = data.message.toLowerCase();
    Dictionnaire.find({
      $text: {
        '$search': data.message,
        '$diacriticSensitive': false}}, function(err, reponse) {
      Dictionnaire.find({
        $text: {
          '$search': data.message,
          '$language': 'none',
          '$diacriticSensitive': false}}, function(err, reponse2) {
        reponse = reponse.concat(reponse2);
        console.log(reponse);
        // Vérifions le nombre de mots trouvés dans le dictionnaire
        let finalWord = '';
        if (reponse.length > 1) {
          if (reponse.find((word) => word.word==data.message)) {
            finalWord = reponse.find((word) => word.word==data.message).word;
          } else {
          // Pour chaque mot, on vérifie si le mot non-accentué correspond
            const nonAccentuedWord = [];
            reponse.forEach(function(item) {
              if (item.word.normalize('NFD').replace(/[\u0300-\u036f]/g, '') == data.message.normalize('NFD').replace(/[\u0300-\u036f]/g, '')) {
                console.log('non-accentued corresponding');
                nonAccentuedWord.push(item.word);
                compareTwoWords.scoreWords('test', 'test');
              };

              if (nonAccentuedWord.length == 0) {
                finalWord = '';
              } else if (nonAccentuedWord.length ==1 ) {
                finalWord = nonAccentuedWord[0];
              } else {
                const scores = [];
                nonAccentuedWord.forEach(function(item) {
                  scores.push(compareTwoWords.scoreWords(item, data.message));
                });
                console.log(scores);
                console.log(Math.max.apply(null, scores));
                console.log(scores.indexOf(Math.max.apply(null, scores)));
                console.log(nonAccentuedWord);
                finalWord = nonAccentuedWord[scores.indexOf(Math.max.apply(null, scores))];
              }
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
        // On vérifie que le mot saisi par le guesser n'est pas le mot à deviner
          console.log(data.toGuess);
          console.log(data.userinfos);
          if (data.message == data.toGuess) {
            if (data.userinfos.guesser) {
            // Emit l'evènement la partie est gagnée
              console.log('Partie gagnée');
            } else {
              console.log('Vous ne pouvez pas saisir le mot à deviner');
            }
          } else {
          // Affichage du mot pour le helper
            data.message = finalWord;
            io.to('ROOM').emit('printWord', data);
            // MàJ de l'interface du helper
            io.to(data.userinfos.socketId).emit('wait', data);
            // MàJ de l'interface du guesser
            io.to(data.userinfos.coplayer).emit('send', data);
          }
        }
      });
    });
  });
};
