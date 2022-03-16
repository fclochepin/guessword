module.exports.scoreWords = function(word1, word2) {
  let score = 0;
  // word1 doit toujours être le mot le plus long
  if (word1.length < word2.length) {
    [word1, word2] = [word2, word1];
  }
  for (let i = 0; i < word1.length; i++) {
    if (word1[i] == word2[i]) {
      score++;
    }
  }
  return score;
};
