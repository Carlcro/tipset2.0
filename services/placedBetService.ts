import http from "./httpService";

export function getPlacedBets(userTournamentId: string) {
  return http.get(`/api/user-tournaments/${userTournamentId}/bet-slips`);
}

export function getPlacedBet(placedBetId: string) {
  return http.get(`/api/bet-slips/${placedBetId}`);
}
