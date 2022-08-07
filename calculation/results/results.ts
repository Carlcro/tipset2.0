import { GroupResult } from "./groupResult";
import { MatchResult } from "../matchResult";
import { Match } from "../match";
import { MatchGroup } from "../matchGroup";
import { MatchGroupScores } from "../matchGroupScores";
import { calculateTeamResults } from "../matchGroup/calculations/calculations";
import { Team } from "../team";
import { RawMatchResult } from "../rawMatchResult";

export function calculateGroupResults(
  results: RawMatchResult[],
  matchGroups: MatchGroup[]
): GroupResult[] {
  const scores = getScores(results, 1, 36);
  const groupScores = matchGroups.map(getGroupScores(scores));
  return groupScores.map(getGroupResults());
}

function getScores(
  matchResults: RawMatchResult[],
  fromId: number,
  toId: number
): MatchResult[] {
  return matchResults
    .filter(matchIdRange(fromId, toId))
    .filter(bothScoresAreSet())
    .map(parseScores());
}

function matchIdRange(
  fromId: number,
  toId: number
): (score: RawMatchResult) => boolean {
  return (score) => score.matchId >= fromId && score.matchId <= toId;
}

function bothScoresAreSet(): (score: RawMatchResult) => boolean {
  return (score) => score.team1Score !== "" && score.team2Score !== "";
}

function parseScores(): (score: RawMatchResult) => MatchResult {
  return (score) => {
    return {
      matchId: score.matchId,
      team1: { ...score.team1, name: score.team1.name },
      team2: { ...score.team2, name: score.team2.name },
      team1Score: Number.parseInt(score.team1Score),
      team2Score: Number.parseInt(score.team2Score),
      penaltyWinner: score.penaltyWinner,
    };
  };
}

function getGroupScores(
  scores: MatchResult[]
): (mg: MatchGroup) => MatchGroupScores {
  return (mg) => {
    return { scores: getExistingScores(mg, scores), matchGroup: mg };
  };
}

function getExistingScores(
  mg: MatchGroup,
  scores: MatchResult[]
): MatchResult[] {
  return mg.matches
    .map(findMatchScore(scores))
    .filter(scoreExists()) as MatchResult[];
}

function findMatchScore(
  scores: MatchResult[]
): (match: Match) => MatchResult | undefined {
  return (match) => scores.find((s) => s.matchId === match.matchId);
}

function scoreExists(): (score: MatchResult | undefined) => boolean {
  return (score) => score !== undefined;
}

function getGroupResults(): (group: MatchGroupScores) => GroupResult {
  return (mgs) => {
    return {
      name: "Grupp " + mgs.matchGroup.name,
      results: calculateTeamResults(mgs.scores, mgs.matchGroup.teams),
    };
  };
}

export function calculateGroupOf16Results(results: RawMatchResult[]): Team[] {
  return calculateResults(results, 37, 44);
}

export function calculateGroupOf8Results(results: RawMatchResult[]): Team[] {
  return calculateResults(results, 45, 48);
}

export function calculateSemiFinalsResults(results: RawMatchResult[]): Team[] {
  return calculateResults(results, 49, 50);
}

function calculateResults(
  results: RawMatchResult[],
  fromId: number,
  toId: number
): Team[] {
  const scores = getScores(results, fromId, toId);
  return scores.map(getWinningTeam()).filter((t) => t !== undefined);
}

function getWinningTeam(): (score: MatchResult) => Team {
  return (score) => {
    if (score.team1Score > score.team2Score) {
      return score.team1;
    } else if (score.team1Score < score.team2Score) {
      return score.team2;
    } else {
      return score.penaltyWinner as Team;
    }
  };
}
