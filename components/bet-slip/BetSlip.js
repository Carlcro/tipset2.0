import React from "react";
import MatchGroup from "./MatchGroup";
import GroupBoard from "./GroupBoard";
import GoalscorerInput from "./GoalscorerInput";
import { useRecoilValue, useSetRecoilState, useRecoilState } from "recoil";

import TiebreakerInfo from "./TiebreakerInfo";
import { goalscorerState } from "../../recoil/bet-slip/atoms";
import {
  resetAllBets,
  setAllMatchesState,
} from "../../recoil/bet-slip/selectors/selectors";
import {
  getGroupOf16,
  getGroupOf8,
  getSemifinals,
  getFinal,
} from "../../recoil/bet-slip/selectors/matches";
import { championshipState } from "../../recoil/championship/selectors";

const BetSlip = ({ mode, bettingAllowed, handleSave, error }) => {
  const championship = useRecoilValue(championshipState);
  const groupOf16 = useRecoilValue(getGroupOf16);
  const groupOf8 = useRecoilValue(getGroupOf8);
  const semiFinals = useRecoilValue(getSemifinals);
  const final = useRecoilValue(getFinal);
  const [goalscorer, setGoalscorer] = useRecoilState(goalscorerState);
  const setAllMatches = useSetRecoilState(setAllMatchesState);
  const resetAllMatches = useSetRecoilState(resetAllBets);

  const handleSetAllMatches = () => {
    const matches = championship.matchGroups.flatMap((group) => group.matches);

    setAllMatches(matches);
  };

  const reset = () => {
    const matches = championship.matchGroups.flatMap((group) => group.matches);

    resetAllMatches(matches);
  };

  const show = (stage) => {
    return stage.matches.length > 0
      ? MatchGroup(stage, championship.matchInfos, mode)
      : undefined;
  };

  const handleSetGoalscorer = (goalscorer) => {
    setGoalscorer(goalscorer);
  };

  return (
    <div>
      {mode !== "placedBet" && (
        <div className="mx-auto w-[300px] md:w-[500px] rounded-sm px-3 py-4 shadow-lg bg-white flex flex-col space-y-3 ">
          <h1 className="text-center text-xl">
            Lägg tips för Europamästerskap i fotboll 2021
          </h1>
          {
            <div className="flex justify-center flex-col space-y-2">
              <button
                className="border border-black mx-auto px-3 py-1"
                onClick={handleSetAllMatches}
              >
                Populera alla matcher
              </button>
              <button
                className="border border-black mx-auto px-3 py-1"
                onClick={reset}
              >
                Nollställ tips
              </button>
            </div>
          }
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] mx-5 lg:mx-20">
        <div className="mx-auto">
          {championship.matchGroups.map((group) => show(group))}
          {show(groupOf16)}
          {show(groupOf8)}
          {show(semiFinals)}
          {show(final)}
          <GoalscorerInput
            goalscorer={goalscorer}
            handleSetGoalscorer={handleSetGoalscorer}
            mode={mode}
          />
          {mode !== "placedBet" && (
            <div className="flex mb-10 mt-4">
              {bettingAllowed ? (
                <button
                  className="bg-blue-500 border border-black hover:bg-blue-600 active:bg-blue-700 text-white px-3 py-2 rounded-sm"
                  onClick={handleSave}
                >
                  Spara tips
                </button>
              ) : (
                <div className="rounded-lg my-3 py-1 px-2 ml-3  text-red-500 font-bold">
                  Det är inte längre tillåtet att uppdatera ditt tips.
                </div>
              )}
              {error && (
                <div className="rounded-lg my-3 py-1 px-2 ml-3 text-red-500 font-bold">
                  {error}
                </div>
              )}
            </div>
          )}
        </div>
        <div className="mx-auto max-w-[500px] lg:max-w-[450px] ">
          <GroupBoard />
          {mode === "betslip" && <TiebreakerInfo />}
        </div>
      </div>
    </div>
  );
};

export default BetSlip;
