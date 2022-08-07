import http from "./httpService";

interface IBetSlip {
  bets: [IMatchResult];
  goalscorer: string;
}

interface IMatchResult {
  matchId: number;
  team1Score: string;
  team2Score: string;
  team1: string;
  team2: string;
}

export function createBetSlip(bet: IBetSlip) {
  return http.post(`/api/bet-slips`, bet);
}

export function getBetSlip() {
  return http.get(`/api/bet-slips`);
}

export function getAllPlayers() {
  return http.get("/api/players");
}
