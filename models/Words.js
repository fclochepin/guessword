const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const wordsSchema = new Schema({
  word: String, // String is shorthand for {type: String}
  tag: String,
}, {collection: 'words'});

module.exports = Words = mongoose.model('Words', wordsSchema);
