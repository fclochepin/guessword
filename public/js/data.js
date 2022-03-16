// Cette classe permet de stocker les données de jeu
let allData = {};

/**
 * Permet de modifier le dictionnaire de données
 * @param {dict} newData - Dictionnaire modifié
 */
export function setData(newData) {
  allData = newData;
};

/**
 * Permet de retourner le dictionnaire de données
 * @return {dict} allData - Dictionnaire retourné
 */
export function getData() {
  return allData;
}
