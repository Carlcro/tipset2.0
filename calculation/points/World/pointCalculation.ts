import { GoalScorer } from "../../types/goalScorer";
import { GroupResult } from "../../results/groupResult";
import {
  calculateAdvanceToGroupOf16Points,
  calculateFinalAdvancePoints,
  calculateFinalMatchPoints,
  calculateGoalScorer,
  calculateGroupOf16AdvancePoints,
  calculateGroupOf16MatchPoints,
  calculateGroupOf8AdvancePoints,
  calculateGroupOf8MatchPoints,
  calculateGroupStageScorePoints,
  calculatePositionPoints,
  calculateSemiFinalAdvancePoints,
  calculateSemiFinalMatchPoints,
  isGroupFinished,
} from "../common";
import { calculateTeamRanking } from "../../matchGroup/World/calculations";
import { MatchResult } from "../../types/matchResult";

export function calculatePoints(
  betGroupResults: GroupResult[],
  betMatchResults: MatchResult[],
  betGoalScorer: string,
  adjustedPoints: number,
  outcomeGroupsResults: GroupResult[],
  outcomeMatchResults: MatchResult[],
  outcomeGoalScorer: GoalScorer
): number {
  const positionPoints = betGroupResults
    .map((groupResult, i): number => {
      return calculatePointsFromGroup(
        groupResult,
        outcomeGroupsResults[i],
        betMatchResults,
        outcomeMatchResults
      );
    })
    .reduce((x, y) => x + y, 0);

  const matchPoints = outcomeMatchResults
    .map((or) => {
      const matchResult = betMatchResults.find((x) => x.matchId === or.matchId);
      if (matchResult) {
        return getMatchPoint(or, matchResult);
      } else {
        return 0;
      }
    })
    .reduce((acc, x) => acc + x, 0);

  const correctAdvancedTeam = calculateCorrectAdvanceTeam(
    betMatchResults,
    outcomeMatchResults
  );

  const goalScorerPoints = calculateGoalScorer(
    betGoalScorer,
    outcomeGoalScorer
  );

  return (
    matchPoints +
    goalScorerPoints +
    positionPoints +
    correctAdvancedTeam +
    adjustedPoints
  );
}

export const getMatchPoint = (
  outcomeResult: MatchResult,
  matchResult: MatchResult
) => {
  if (outcomeResult.matchId <= 48) {
    return calculateGroupStageScorePoints(matchResult, outcomeResult);
  } else if (outcomeResult.matchId <= 56) {
    return calculateGroupOf16MatchPoints(matchResult, outcomeResult);
  } else if (outcomeResult.matchId <= 60) {
    return calculateGroupOf8MatchPoints(matchResult, outcomeResult);
  } else if (outcomeResult.matchId <= 62) {
    return calculateSemiFinalMatchPoints(matchResult, outcomeResult);
  } else {
    return calculateFinalMatchPoints(matchResult, outcomeResult);
  }
};

const calculateCorrectAdvanceTeam = (
  betMatchResults: MatchResult[],
  outcomeMatchResults: MatchResult[]
): number => {
  return (
    calculateGroupOf16AdvancePoints(
      betMatchResults,
      outcomeMatchResults,
      57,
      60
    ) +
    calculateGroupOf8AdvancePoints(
      betMatchResults,
      outcomeMatchResults,
      61,
      62
    ) +
    calculateSemiFinalAdvancePoints(
      betMatchResults,
      outcomeMatchResults,
      63,
      63
    ) +
    calculateFinalAdvancePoints(betMatchResults, outcomeMatchResults, 51)
  );
};

export const calculatePointsFromGroup = (
  groupResult: GroupResult,
  groupOutcome: GroupResult,
  betMatchResults: MatchResult[],
  outcomeMatchResults: MatchResult[]
): number => {
  const betTeamRanking = calculateTeamRanking(
    groupResult.results,
    betMatchResults
  );
  const outcomeTeamRanking = calculateTeamRanking(
    groupOutcome.results,
    outcomeMatchResults
  );

  if (isGroupFinished(groupOutcome)) {
    return (
      calculatePositionPoints(betTeamRanking, outcomeTeamRanking) +
      calculateAdvanceToGroupOf16Points(betTeamRanking, outcomeTeamRanking)
    );
  } else {
    return 0;
  }
};
