const socket = io();

/**
 * Cette fonction crée un socket et le retourne aux autres services
 * @return {io} socket - le socket qui est retourné
 */
export function getSocket() {
  return socket;
};
