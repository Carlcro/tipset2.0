import { selector } from "recoil";
import {
  calculateFinal,
  calculateGroupOf16,
  calculateGroupOf8,
  calculateSemiFinals,
  calculateTeamRanking,
} from "../../../../calculation/matchGroup/calculations/calculations";

import { betSlipState } from "../atoms";
import {
  getGroupResults,
  selectGroupOf16Results,
  selectGroupOf8Results,
  getSemiFinalsResults,
} from "./results";
import {
  calculateTopFourThirdPlaces,
  getBestOfThirds,
} from "../../../../calculation/matchGroup/calculations/thirdPlacements";

export const getGroupOf16 = selector({
  key: "getGroupOf16State",
  get: ({ get }) => {
    const groupResults = get(getGroupResults);

    const betSlip = get(betSlipState);

    const allGroupMatchesSet =
      betSlip.filter((match) => match.matchId <= 36).length >= 36;

    const teamRankings = groupResults
      .map((gr) => calculateTeamRanking(gr.results, betSlip))
      .map((results) => ({ teams: results.map((result) => result.team) }));
    const bestOfThirds = getBestOfThirds(groupResults, betSlip);

    return {
      name: "Åttondelsfinaler",
      matches: allGroupMatchesSet
        ? calculateGroupOf16(teamRankings, bestOfThirds)
        : [],
      finalsStage: true,
    };
  },
});

export const getBestThirds = selector({
  key: "bestThirds",
  get: ({ get }) => {
    const groupResults = get(getGroupResults);
    const betSlip = get(betSlipState);

    const bestOfThirds = calculateTopFourThirdPlaces(groupResults, betSlip);

    return { name: "Topp treor", results: bestOfThirds };
  },
});

export const getGroupOf8 = selector({
  key: "getGroupOf8State",
  get: ({ get }) => {
    const groupOf16 = get(selectGroupOf16Results);

    return {
      name: "Kvartsfinaler",
      matches: calculateGroupOf8(groupOf16),
      finalsStage: true,
    };
  },
});

export const getSemifinals = selector({
  key: "getSemiFinalsState",
  get: ({ get }) => {
    const groupOf8 = get(selectGroupOf8Results);

    return {
      name: "Semifinaler",
      matches: calculateSemiFinals(groupOf8),
      finalsStage: true,
    };
  },
});

export const getFinal = selector({
  key: "getFinalsState",
  get: ({ get }) => {
    const groupOf8 = get(getSemiFinalsResults);

    return {
      name: "Final",
      matches: calculateFinal(groupOf8),
      finalsStage: true,
    };
  },
});
