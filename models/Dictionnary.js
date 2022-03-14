const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dictSchema = new Schema({
  word: String, // String is shorthand for {type: String}
}, {collection: 'dictionnaire'});

module.exports = Dictionnaire = mongoose.model('Dictionnaire', dictSchema);
