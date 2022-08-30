import { TeamResult } from "./../teamResult";
import { Team } from "./../team";
import { MatchResult } from "./../matchResult";

export function calculateTeamResults(
  results: MatchResult[],
  teams: Team[]
): TeamResult[] {
  const teamPoints = calculateTeamPoints(results, teams);
  const goalDifference = calculateGoalDifference(results, teams);
  const goals = calculateGoals(results, teams);
  const conceded = calculateConceded(results, teams);
  const gamesPlayed = calculateGamesPlayed(results, teams);
  const gamesWon = calculateGamesWon(results, teams);
  const gamesLost = calculateGamesLost(results, teams);
  const gamesDraw = calculateGamesDraw(results, teams);

  const teamResults: TeamResult[] = [];
  teams.forEach((team) => {
    teamResults.push({
      team: team,
      goals: goals.get(team.name),
      conceded: conceded.get(team.name),
      diff: goalDifference.get(team.name),
      points: teamPoints.get(team.name),
      played: gamesPlayed.get(team.name),
      won: gamesWon.get(team.name),
      lost: gamesLost.get(team.name),
      draw: gamesDraw.get(team.name),
    });
  });

  return teamResults;
}

function calculateGamesDraw(results: MatchResult[], teams: Team[]) {
  return calculate(results, teams, gamesDrawCalculation);
}

function gamesDrawCalculation(r: MatchResult, data: Map<string, number>) {
  if (r.team1Score === r.team2Score) {
    update(data, r.team1.name, 1);
    update(data, r.team2.name, 1);
  }
}

function calculateGamesLost(results: MatchResult[], teams: Team[]) {
  return calculate(results, teams, gamesLostCalculation);
}

function gamesLostCalculation(r: MatchResult, data: Map<string, number>) {
  if (r.team1Score < r.team2Score) {
    update(data, r.team1.name, 1);
  } else if (r.team1Score > r.team2Score) {
    update(data, r.team2.name, 1);
  }
}

function calculateGamesWon(results: MatchResult[], teams: Team[]) {
  return calculate(results, teams, gamesWonCalculation);
}

function gamesWonCalculation(r: MatchResult, data: Map<string, number>) {
  if (r.team1Score > r.team2Score) {
    update(data, r.team1.name, 1);
  } else if (r.team1Score < r.team2Score) {
    update(data, r.team2.name, 1);
  }
}

function calculateGamesPlayed(results: MatchResult[], teams: Team[]) {
  return calculate(results, teams, gamesPlayedCalculation);
}

export function gamesPlayedCalculation(
  r: MatchResult,
  data: Map<string, number>
) {
  update(data, r.team1.name, 1);
  update(data, r.team2.name, 1);
}

export function calculateTeamPoints(results: MatchResult[], teams: Team[]) {
  return calculate(results, teams, teamPointsCalculation);
}

function teamPointsCalculation(r: MatchResult, data: Map<string, number>) {
  if (r.team1Score > r.team2Score) {
    update(data, r.team1.name, 3);
  } else if (r.team1Score < r.team2Score) {
    update(data, r.team2.name, 3);
  } else {
    update(data, r.team1.name, 1);
    update(data, r.team2.name, 1);
  }
}

export function calculateGoalDifference(results: MatchResult[], teams: Team[]) {
  return calculate(results, teams, goalDifferenceCalculation);
}

function goalDifferenceCalculation(r: MatchResult, data: Map<string, number>) {
  update(data, r.team1.name, r.team1Score - r.team2Score);
  update(data, r.team2.name, r.team2Score - r.team1Score);
}

export function calculateGoals(results: MatchResult[], teams: Team[]) {
  return calculate(results, teams, goalCalculation);
}

function goalCalculation(r: MatchResult, data: Map<string, number>) {
  update(data, r.team1.name, r.team1Score);
  update(data, r.team2.name, r.team2Score);
}

export function calculateConceded(results: MatchResult[], teams: Team[]) {
  return calculate(results, teams, concededCalculation);
}

function concededCalculation(r: MatchResult, data: Map<string, number>) {
  update(data, r.team1.name, r.team2Score);
  update(data, r.team2.name, r.team1Score);
}

function calculate(
  results: MatchResult[],
  teams: Team[],
  calculation: (r: MatchResult, data: Map<string, number>) => void
) {
  let data = initializeMapToZero(teams);

  results.forEach((r) => calculation(r, data));

  return data;
}

function initializeMapToZero(teams: Team[]) {
  let data = new Map();
  teams.forEach((t) => data.set(t.name, 0));
  return data;
}

function update(data: Map<string, number>, key: string, amount: number) {
  const value = data.get(key) || 0;
  data.set(key, value + amount);
}
