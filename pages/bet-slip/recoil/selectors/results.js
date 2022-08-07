import { selector } from "recoil";
import { calculateTeamRanking } from "../../../../calculation/matchGroup/calculations/calculations";
import {
  calculateGroupOf16Results,
  calculateGroupOf8Results,
  calculateGroupResults,
  calculateSemiFinalsResults,
} from "../../../../calculation/results/results";
import { championshipState } from "../../../championship/recoil/selectors";
import { betSlipState } from "../atoms";

export const getGroupResults = selector({
  key: "getGroupResults",
  get: ({ get }) => {
    const betSlip = get(betSlipState);

    const championship = get(championshipState);

    return calculateGroupResults(betSlip, championship.matchGroups);
  },
});

export const getSortedGroupResults = selector({
  key: "getSortedGroupResults",
  get: ({ get }) => {
    const groupResults = get(getGroupResults);

    const betSlip = get(betSlipState);

    const teamRankings = groupResults.map((gr) => ({
      name: gr.name,
      results: calculateTeamRanking(gr.results, betSlip),
    }));

    return teamRankings;
  },
});

export const selectGroupOf16Results = selector({
  key: "getGroupOf16Results",
  get: ({ get }) => {
    const betSlip = get(betSlipState);

    return calculateGroupOf16Results(betSlip);
  },
});

export const selectGroupOf8Results = selector({
  key: "getGroupOf8Results",
  get: ({ get }) => {
    const betSlip = get(betSlipState);

    return calculateGroupOf8Results(betSlip);
  },
});

export const getSemiFinalsResults = selector({
  key: "getSemiFinalsResults",
  get: ({ get }) => {
    const betSlip = get(betSlipState);

    return calculateSemiFinalsResults(betSlip);
  },
});
