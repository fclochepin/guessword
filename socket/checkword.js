// Socket gérant la verification du mot proposé par le helper
const Dictionnaire = require('../models/Dictionnary');
const compareTwoWords = require('../shared/compareTwoWords');

const io = require('../server').io;
const users = require('../shared/users').users;

module.exports = async function(socket) {
  socket.on('newword', async function(data) {
    // Le helper vient de soumettre un newword
    // Vérifions que le mot existe dans le dictionnaire
    // Verification que le mot est bien présent dans le dictionnaire
    data.message = data.message.toLowerCase();
    Dictionnaire.find({
      $text: {
        '$search': data.message,
        '$diacriticSensitive': false}}, async function(err, reponse) {
      Dictionnaire.find({
        $text: {
          '$search': data.message,
          '$language': 'none',
          '$diacriticSensitive': false}}, async function(err, reponse2) {
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
              if (item.word.normalize('NFD').replace(/[\u0300-\u036f]/g, '') ==
              data.message.normalize('NFD').replace(/[\u0300-\u036f]/g, '')) {
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
                finalWord = nonAccentuedWord[
                    scores.indexOf(Math.max.apply(null, scores))];
              }
            });
          };
        } else {
          console.log(reponse.length);
          if (reponse.length!=0) {
            // Le mot est bien dans le dictionnaire
            finalWord = reponse[0].word;
          }
        }

        console.log(finalWord);
        if (finalWord == '') {
          io.to(data.userinfos.socketId).emit('wordNotInDictionnary');
        } else {
        // On vérifie que le mot saisi par le guesser n'est pas le mot à deviner
          console.log(data.toGuess);
          console.log(data.userinfos);
          if (data.message == data.toGuess) {
            console.log(data.userinfos);
            if (data.userinfos.guesser) {
              // S'il reste des round, on lance un nouveau round
              if (data.round < data.nbRound) {
                const R = Math.random() * reponse;
                Words.find(function(err, reponse) {
                  // Changement de rôle
                  data.userinfos.guesser = !data.userinfos.guesser;
                  data.message = '';
                  data.round++;
                  data.toGuess = reponse[0].word;

                  // Pour le helper
                  console.log('send to helper');
                  io.to(socket.id).emit('newRoundHelper', data);

                  // Traitement de l'autre user
                  data.userinfos = users.find(
                      (user) => user.socketId ===
                      data.userinfos.coplayer);

                  data.userinfos.guesser = !data.userinfos.guesser;

                  // Pour le guesser
                  io.to(data.userinfos.socketId).emit(
                      'newRoundGuesser', data);
                }).limit(1).skip(R);
              }
              // await new Promise((resolve) => setTimeout(resolve, 4000));
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

