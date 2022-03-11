const res = require('express/lib/response');
const Words = require('./Words');

module.exports = class WordsService {
  /**
 * Récuperer la liste de l'ensemble des mots
 */
  static async getAllWords() {
    try {
      Words.find({}, {'_id': 0, 'word': 1}, function(err, reponse) {
        if (err) {
          throw err;
        } else {
          res.json(reponse);
        }
      });
    } catch (error) {
      console.log(`Could not fetch all words ${error}`);
    }
  }

  /**
 * Retourne un mot aléatoire dans la base
 */
  static async getOneWord() {
    const countWords = await Words.count();
  }
};
