import { betSlipState, goalscorerState } from "../../../recoil/bet-slip/atoms";
import { selector, selectorFamily } from "recoil";
import {
  calculateGroupResults,
  calculateGroupOf16Results,
  calculateSemiFinalsResults,
  calculateFinal,
  calculateGroupOf16,
  calculateGroupOf8,
  calculateSemiFinals,
  calculateTeamRanking,
  getBestOfThirds,
  calculateGroupOf8Results,
} from "../../../calculation";
import { championshipState } from "../../../recoil/championship/selectors";

export const setAllMatchesState = selector({
  key: "setAllMatches",
  set: ({ set }, newValue) => {
    const betSlip = [];
    newValue.forEach((match) => {
      betSlip.push({
        matchId: match.matchId,
        team1Score: Math.floor(10 * Math.random()),
        team2Score: Math.floor(10 * Math.random()),
        team1: match.team1,
        team2: match.team2,
      });
    });

    set(betSlipState, betSlip);
  },

  get: () => {},
});

export const resetAllBets = selector({
  key: "resetAllBets",
  set: ({ set }) => {
    const betSlip = [];

    set(betSlipState, betSlip);
  },
  get: () => {},
});

export const setFromBetslipState = selector({
  key: "setFromBetslip",
  set: ({ set }, newValue) => {
    const betSlip = [];
    newValue.bets.forEach((match) => {
      const newBet = {
        matchId: match.matchId,
        team1Score: match.team1Score,
        team2Score: match.team2Score,
        team1: match.team1,
        team2: match.team2,
        points: match.points,
      };
      if (match.penaltyWinner) {
        newBet.penaltyWinner = match.penaltyWinner;
      }

      betSlip.push(newBet);
    });
    set(betSlipState, betSlip);
    set(goalscorerState, newValue.goalscorer);
  },

  get: () => {},
});

export const getMatchState = selectorFamily({
  key: "getMatch",
  get:
    (matchId) =>
    ({ get }) => {
      const match = get(betSlipState).find((x) => x.matchId === matchId);

      if (!match)
        return {
          matchId,
          team1Score: "",
          team2Score: "",
        };
      return match;
    },
});

export const getMatchDrawState = selectorFamily({
  key: "getMatchDraw",
  get:
    (matchId) =>
    ({ get }) => {
      const match = get(betSlipState).find((x) => x.matchId === matchId);

      if (!match) return false;

      return match.team1Score === match.team2Score;
    },
});

export const setMatchState = selector({
  key: "setMatch",
  set: ({ get, set }, newValue) => {
    const betSlip = [...get(betSlipState)];
    const championship = get(championshipState);

    const index1 = betSlip.findIndex(
      (match) => match.matchId === newValue.matchId
    );
    if (index1 > -1) {
      betSlip.splice(index1, 1);
    }
    betSlip.push(newValue);

    const groupResults = calculateGroupResults(
      betSlip,
      championship.matchGroups
    );

    const teamRankings = groupResults
      .map((gr) => calculateTeamRanking(gr.results, betSlip))
      .map((results) => ({ teams: results.map((result) => result.team) }));
    const bestOfThirds = getBestOfThirds(groupResults, betSlip);

    const newGroupOf16 = calculateGroupOf16(teamRankings, bestOfThirds);
    newGroupOf16.forEach((newMatch, newIndex) => {
      const index2 = betSlip.findIndex(
        (match) => match.matchId === newMatch.matchId
      );
      if (betSlip[index2]) {
        const newResult = {
          ...betSlip[index2],
          team1: newGroupOf16[newIndex].team1,
          team2: newGroupOf16[newIndex].team2,
        };

        betSlip.splice(index2, 1);
        betSlip.push(newResult);
      }
    });

    const groupOf16Result = calculateGroupOf16Results(betSlip);
    const newGroupOf8 = calculateGroupOf8(groupOf16Result);

    newGroupOf8.forEach((newMatch, newIndex) => {
      const index3 = betSlip.findIndex(
        (match) => match.matchId === newMatch.matchId
      );
      if (betSlip[index3]) {
        const newResult = {
          ...betSlip[index3],
          team1: newGroupOf8[newIndex].team1,
          team2: newGroupOf8[newIndex].team2,
        };
        betSlip.splice(index3, 1);
        betSlip.push(newResult);
      }
    });

    const groupOf8Result = calculateGroupOf8Results(betSlip);
    const newSemiFinals = calculateSemiFinals(groupOf8Result);

    newSemiFinals.forEach((newMatch, newIndex) => {
      const index4 = betSlip.findIndex(
        (match) => match.matchId === newMatch.matchId
      );

      if (betSlip[index4]) {
        const newResult = {
          ...betSlip[index4],
          team1: newSemiFinals[newIndex].team1,
          team2: newSemiFinals[newIndex].team2,
        };
        betSlip.splice(index4, 1);
        betSlip.push(newResult);
      }
    });

    const semiFinal = calculateSemiFinalsResults(betSlip);
    const newFinal = calculateFinal(semiFinal);

    newFinal.forEach((newMatch, newIndex) => {
      const index5 = betSlip.findIndex(
        (match) => match.matchId === newMatch.matchId
      );

      if (betSlip[index5]) {
        const newResult = {
          ...betSlip[index5],
          team1: newFinal[newIndex].team1,
          team2: newFinal[newIndex].team2,
        };
        betSlip.splice(index5, 1);
        betSlip.push(newResult);
      }
    });

    set(betSlipState, betSlip);
  },
  get: () => {},
});
