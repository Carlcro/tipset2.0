import { GoalScorer } from "./../goalScorer";
import { TeamResult } from "./../teamResult";
import { GroupResult } from "../results/groupResult";
import { MatchResult } from "../matchResult";
import { calculateTeamRanking } from "../matchGroup/calculations/calculations";
import { getBestOfThirds } from "../matchGroup/calculations/thirdPlacements";

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

  let bestOfThirdsPoints = 0;

  if (allGroupMatchesSet(outcomeMatchResults)) {
    bestOfThirdsPoints = calculateBestOfThirdPoints(
      betGroupResults,
      outcomeGroupsResults,
      betMatchResults,
      outcomeMatchResults
    );
  }

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
    bestOfThirdsPoints +
    correctAdvancedTeam +
    adjustedPoints
  );
}

export const calculateCorrectAdvanceTeam = (
  betMatchResults: MatchResult[],
  outcomeMatchResults: MatchResult[]
): number => {
  return (
    calculateGroupOf16AdvancePoints(betMatchResults, outcomeMatchResults) +
    calculateGroupOf8AdvancePoints(betMatchResults, outcomeMatchResults) +
    calculateSemiFinalAdvancePoints(betMatchResults, outcomeMatchResults) +
    calculateFinalAdvancePoints(betMatchResults, outcomeMatchResults)
  );
};
export const calculateGroupOf16AdvancePoints = (
  betMatchResults: MatchResult[],
  outcomeMatchResults: MatchResult[]
): number => {
  let points = 0;
  const teamsInBestOf8Bet = getTeamsInMatches(betMatchResults, 45, 48);
  const teamsInBestOf8Outcome = getTeamsInMatches(outcomeMatchResults, 45, 48);

  teamsInBestOf8Bet.forEach((t) => {
    if (teamsInBestOf8Outcome.includes(t)) points = points + 25;
  });

  return points;
};

export const calculateGroupOf8AdvancePoints = (
  betMatchResults: MatchResult[],
  outcomeMatchResults: MatchResult[]
): number => {
  let points = 0;
  const teamsInBestOf8Bet = getTeamsInMatches(betMatchResults, 49, 50);
  const teamsInBestOf8Outcome = getTeamsInMatches(outcomeMatchResults, 49, 50);

  teamsInBestOf8Bet.forEach((t) => {
    if (teamsInBestOf8Outcome.includes(t)) points = points + 25;
  });

  return points;
};

export const calculateSemiFinalAdvancePoints = (
  betMatchResults: MatchResult[],
  outcomeMatchResults: MatchResult[]
): number => {
  let points = 0;
  const teamsInBestOf8Bet = getTeamsInMatches(betMatchResults, 51, 51);
  const teamsInBestOf8Outcome = getTeamsInMatches(outcomeMatchResults, 51, 51);

  teamsInBestOf8Bet.forEach((t) => {
    if (teamsInBestOf8Outcome.includes(t)) points = points + 30;
  });

  return points;
};

export const calculateFinalAdvancePoints = (
  betMatchResults: MatchResult[],
  outcomeMatchResults: MatchResult[]
): number => {
  let points = 0;
  const bet = betMatchResults.find((mr) => mr.matchId === 51);
  const outcome = outcomeMatchResults.find((mr) => mr.matchId === 51);

  if (bet && outcome) {
    points = calculateAdvancePoints(bet, outcome, 35);
  }

  return points;
};

export const getTeamsInMatches = (
  betMatchResults: MatchResult[],
  fromId: number,
  toId: number
): string[] => {
  const teams = betMatchResults.reduce<string[]>((acc, curr) => {
    if (curr.matchId >= fromId && curr.matchId <= toId) {
      return [...acc, curr.team1._id, curr.team2._id];
    }
    return acc;
  }, []);

  return teams;
};

export const calculateBestOfThirdPoints = (
  betGroupResults: GroupResult[],
  groupOutcomes: GroupResult[],
  betMatchResults: MatchResult[],
  outcomeMatchResults: MatchResult[]
): number => {
  const betBestOfThirds = getBestOfThirds(betGroupResults, betMatchResults).map(
    (r) => r._id
  );
  const outcomeBestOfThirds = getBestOfThirds(
    groupOutcomes,
    outcomeMatchResults
  ).map((r) => r._id);

  let points = 0;
  if (betBestOfThirds.length === outcomeBestOfThirds.length) {
    outcomeBestOfThirds.forEach((outcome) => {
      if (betBestOfThirds.includes(outcome)) {
        points = points + 10;
      }
    });
  }
  return points;
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

export const getMatchPoint = (
  outcomeResult: MatchResult,
  matchResult: MatchResult
) => {
  if (outcomeResult.matchId <= 36) {
    return calculateGroupStageScorePoints(matchResult, outcomeResult);
  } else if (outcomeResult.matchId <= 44) {
    return calculateGroupOf16MatchPoints(matchResult, outcomeResult);
  } else if (outcomeResult.matchId <= 48) {
    return calculateGroupOf8MatchPoints(matchResult, outcomeResult);
  } else if (outcomeResult.matchId <= 50) {
    return calculateSemiFinalMatchPoints(matchResult, outcomeResult);
  } else {
    return calculateFinalMatchPoints(matchResult, outcomeResult);
  }
};

function calculateGoalScorer(
  betGoalScorer: string,
  outcomeGoalScorer: GoalScorer
) {
  if (outcomeGoalScorer && outcomeGoalScorer.player === betGoalScorer) {
    return outcomeGoalScorer.goals * 10;
  }

  return 0;
}

export function calculateThirdPlaceMatchPoints(
  bet: MatchResult,
  outcome: MatchResult
) {
  return (
    calculateThirdPlaceCorrectScorePoints(bet, outcome) +
    calculateThirdPlaceSymbolPoints(bet, outcome)
  );
}

export function calculateFinalMatchPoints(
  bet: MatchResult,
  outcome: MatchResult
) {
  return (
    calculateFinalCorrectScorePoints(bet, outcome) +
    calculateFinalSymbolPoints(bet, outcome)
  );
}

export function calculateFinalCorrectScorePoints(
  bet: MatchResult,
  outcome: MatchResult
) {
  return calculateStageMatchPoints(bet, outcome, 25);
}

export function calculateFinalSymbolPoints(
  bet: MatchResult,
  outcome: MatchResult
) {
  return calculateStageSymbolPoints(bet, outcome, 25);
}

export function calculateThirdPlaceAdvancePoints(
  bet: MatchResult,
  outcome: MatchResult
) {
  return calculateAdvancePoints(bet, outcome, 30);
}

export function calculateThirdPlaceSymbolPoints(
  bet: MatchResult,
  outcome: MatchResult
) {
  return calculateStageSymbolPoints(bet, outcome, 20);
}

export function calculateThirdPlaceCorrectScorePoints(
  bet: MatchResult,
  outcome: MatchResult
) {
  return calculateStageMatchPoints(bet, outcome, 20);
}

export function calculateSemiFinalMatchPoints(
  bet: MatchResult,
  outcome: MatchResult
) {
  return (
    calculateSemiFinalCorrectScorePoints(bet, outcome) +
    calculateSemiFinalSymbolPoints(bet, outcome)
  );
}

export function calculateSemiFinalSymbolPoints(
  bet: MatchResult,
  outcome: MatchResult
) {
  return calculateStageSymbolPoints(bet, outcome, 20);
}

export function calculateSemiFinalCorrectScorePoints(
  bet: MatchResult,
  outcome: MatchResult
) {
  return calculateStageMatchPoints(bet, outcome, 20);
}

export function calculateGroupOf8MatchPoints(
  betMatch: MatchResult,
  bet: MatchResult
) {
  return (
    calculateGroupOf8CorrectScorePoints(betMatch, bet) +
    calculateGroupOf8SymbolPoints(betMatch, bet)
  );
}

export function calculateGroupOf8SymbolPoints(
  bet: MatchResult,
  outcome: MatchResult
) {
  return calculateStageSymbolPoints(bet, outcome, 15);
}

export function calculateGroupOf8CorrectScorePoints(
  bet: MatchResult,
  outcome: MatchResult
) {
  return calculateStageMatchPoints(bet, outcome, 15);
}

export function calculateGroupOf16MatchPoints(
  bet: MatchResult,
  outcome: MatchResult
) {
  return (
    calculateGroupOf16CorrectScorePoints(bet, outcome) +
    calculateGroupOf16SymbolPoints(bet, outcome)
  );
}

function calculateAdvancePoints(
  bet: MatchResult,
  outcome: MatchResult,
  points: number
) {
  let betWinningTeam;

  if (bet.team1Score > bet.team2Score) {
    betWinningTeam = bet.team1._id;
  } else if (bet.team1Score < bet.team2Score) {
    betWinningTeam = bet.team2._id;
  } else {
    betWinningTeam = bet.penaltyWinner ? bet.penaltyWinner._id : bet.team1._id;
  }

  if (outcome.team1Score > outcome.team2Score) {
    if (outcome.team1._id === betWinningTeam) {
      return points;
    }
  } else if (outcome.team1Score < outcome.team2Score) {
    if (outcome.team2._id === betWinningTeam) {
      return points;
    }
  } else if (betWinningTeam === outcome.penaltyWinner?._id) {
    return points;
  }

  return 0;
}

export function calculateGroupOf16SymbolPoints(
  bet: MatchResult,
  outcome: MatchResult
) {
  return calculateStageSymbolPoints(bet, outcome, 15);
}

function calculateStageSymbolPoints(
  bet: MatchResult,
  outcome: MatchResult,
  points: number
) {
  if (
    bet.team1._id === outcome.team1._id &&
    bet.team2._id === outcome.team2._id &&
    (predictedTeam1Winner(bet, outcome) ||
      predictedTeam2Winner(bet, outcome) ||
      predictedDraw(bet, outcome))
  ) {
    return points;
  } else {
    return 0;
  }
}

export function calculateGroupOf16CorrectScorePoints(
  bet: MatchResult,
  outcome: MatchResult
) {
  return calculateStageMatchPoints(bet, outcome, 15);
}

function calculateStageMatchPoints(
  bet: MatchResult,
  outcome: MatchResult,
  points: number
) {
  if (predictedScoreAndTeamsCorrectly(bet, outcome)) {
    return points;
  } else {
    return 0;
  }
}

function predictedScoreAndTeamsCorrectly(
  bet: MatchResult,
  outcome: MatchResult
) {
  return (
    Number(bet.team1Score) === Number(outcome.team1Score) &&
    Number(bet.team2Score) === Number(outcome.team2Score) &&
    bet.team1._id === outcome.team1._id &&
    bet.team2._id === outcome.team2._id
  );
}

function calculateGroupStageScorePoints(
  bet: MatchResult,
  outcome: MatchResult
) {
  if (predictedScoreCorrectly(bet, outcome)) {
    return 25;
  } else if (
    predictedTeam1Winner(bet, outcome) ||
    predictedTeam2Winner(bet, outcome) ||
    predictedDraw(bet, outcome)
  ) {
    return 20 - penaltyScore(bet, outcome);
  } else {
    return 10 - penaltyScore(bet, outcome);
  }
}

function penaltyScore(bet: MatchResult, outcome: MatchResult) {
  return (
    Math.abs(bet.team1Score - outcome.team1Score) +
    Math.abs(bet.team2Score - outcome.team2Score)
  );
}

function predictedTeam2Winner(bet: MatchResult, outcome: MatchResult) {
  return (
    bet.team1Score < bet.team2Score && outcome.team1Score < outcome.team2Score
  );
}

function predictedDraw(bet: MatchResult, outcome: MatchResult) {
  return (
    bet.team1Score === bet.team2Score &&
    outcome.team1Score === outcome.team2Score
  );
}

function predictedTeam1Winner(bet: MatchResult, outcome: MatchResult) {
  return (
    bet.team1Score > bet.team2Score && outcome.team1Score > outcome.team2Score
  );
}

function predictedScoreCorrectly(bet: MatchResult, outcome: MatchResult) {
  return (
    bet.team1Score === outcome.team1Score &&
    bet.team2Score === outcome.team2Score
  );
}

export function calculatePositionPoints(
  betTeamResult: TeamResult[],
  outcomeTeamResult: TeamResult[]
): number {
  let points = 0;

  for (let i = 0; i < outcomeTeamResult.length; i++) {
    if (betTeamResult[i].team._id === outcomeTeamResult[i].team._id) {
      points += 5;
    }
  }
  return points;
}

export function calculateAdvanceToGroupOf16Points(
  betTeamResult: TeamResult[],
  outcomeTeamResult: TeamResult[]
): number {
  const first = outcomeTeamResult[0].team._id;
  const second = outcomeTeamResult[1].team._id;

  let points = 0;
  if ([first, second].includes(betTeamResult[0].team._id)) {
    points += 10;
  }
  if ([first, second].includes(betTeamResult[1].team._id)) {
    points += 10;
  }
  return points;
}

export function isGroupFinished(groupResult: GroupResult): boolean {
  return groupResult.results.every((team) => team.played === 3);
}

export function allGroupMatchesSet(betSlip: MatchResult[]): boolean {
  return betSlip.filter((match) => match.matchId <= 36).length >= 36;
}
