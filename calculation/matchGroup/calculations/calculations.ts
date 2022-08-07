import { MatchResult } from "../../matchResult";
import { TeamResult } from "../../teamResult";
import { Team } from "../../team";
import { RankedGroup } from "../../rankedGroup";
import { Match } from "../../match";
import { calculateInnerTeamRanking } from "./innerTeamRanking";

export function calculateGroupOf16(
  rankedGroups: RankedGroup[],
  bestOfThirds: Team[]
): Match[] {
  if (rankedGroups.reduce((acc, x) => acc + x.teams.length, 0) < 24) {
    return [];
  }

  return [
    {
      matchId: 40,
      team1: rankedGroups[1].teams[0],
      team2: bestOfThirds[0],
    },
    {
      matchId: 38,
      team1: rankedGroups[0].teams[0],
      team2: rankedGroups[2].teams[1],
    },
    {
      matchId: 42,
      team1: rankedGroups[5].teams[0],
      team2: bestOfThirds[3],
    },
    {
      matchId: 41,
      team1: rankedGroups[3].teams[1],
      team2: rankedGroups[4].teams[1],
    },
    {
      matchId: 44,
      team1: rankedGroups[4].teams[0],
      team2: bestOfThirds[2],
    },
    {
      matchId: 43,
      team1: rankedGroups[3].teams[0],
      team2: rankedGroups[5].teams[1],
    },
    {
      matchId: 39,
      team1: rankedGroups[2].teams[0],
      team2: bestOfThirds[1],
    },
    {
      matchId: 37,
      team1: rankedGroups[0].teams[1],
      team2: rankedGroups[1].teams[1],
    },
  ];
}

export function calculateGroupOf8(teams: Team[]): Match[] {
  if (teams.length < 8) {
    return [];
  }

  return [
    {
      matchId: 45,
      team1: teams[2],
      team2: teams[3],
    },
    {
      matchId: 46,
      team1: teams[0],
      team2: teams[1],
    },
    {
      matchId: 47,
      team1: teams[6],
      team2: teams[7],
    },
    {
      matchId: 48,
      team1: teams[4],
      team2: teams[5],
    },
  ];
}

export function calculateSemiFinals(teams: Team[]): Match[] {
  if (teams.length < 4) {
    return [];
  }

  return [
    {
      matchId: 49,
      team1: teams[1],
      team2: teams[0],
    },
    {
      matchId: 50,
      team1: teams[3],
      team2: teams[2],
    },
  ];
}

export function calculateFinal(teams: Team[]): Match[] {
  if (teams.length < 2) {
    return [];
  }

  return [
    {
      matchId: 51,
      team1: teams[0],
      team2: teams[1],
    },
  ];
}

export function calculateTeamRanking(
  teamResults: TeamResult[],
  matches: MatchResult[]
): TeamResult[] {
  const results = [...teamResults];
  const groupMatches = [...matches].filter((x) => Boolean(x.matchId));
  const innerRanking = calculateInnerTeamRanking(results, groupMatches);

  results.sort((a, b) => {
    if (a.points !== b.points) {
      return b.points - a.points;
    } else {
      if (innerRanking.findIndex((x) => x._id === a.team._id) < 0) {
        return 1;
      }
      return (
        innerRanking.findIndex((x) => x._id === b.team._id) -
        innerRanking.findIndex((x) => x._id === a.team._id)
      );
    }
  });

  return results;
}

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
