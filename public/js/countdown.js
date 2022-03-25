// Cette classe permet de stocker les données de jeu
let countdown;

/**
 * Permet de modifier le dictionnaire de données
 * @param {dict} newCountdown - Dictionnaire modifié
 */
export function setCd(newCountdown) {
  countdown = newCountdown;
};

/**
 * Permet de retourner le dictionnaire de données
 * @return {dict} allData - Dictionnaire retourné
 */
export function getCd() {
  return countdown;
}
