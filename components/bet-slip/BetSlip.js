import React, { useMemo } from "react";
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
  getThirdPlaceFinal,
} from "../../recoil/bet-slip/selectors/matches";
import { championshipState } from "../../recoil/championship/selectors";
import Container from "../Container";
import SubmitButton from "../SubmitButton";

const BetSlip = ({ mode, bettingAllowed, handleSave, setFinalsMatches }) => {
  const championship = useRecoilValue(championshipState);
  const groupOf16 = useRecoilValue(getGroupOf16);
  const groupOf8 = useRecoilValue(getGroupOf8);
  const semiFinals = useRecoilValue(getSemifinals);
  const thirdPlaceFinal = useRecoilValue(getThirdPlaceFinal);
  const final = useRecoilValue(getFinal);
  const [goalscorer, setGoalscorer] = useRecoilState(goalscorerState);

  useMemo(() => {
    if (setFinalsMatches) {
      setFinalsMatches([
        ...groupOf16.matches,
        ...groupOf8.matches,
        ...semiFinals.matches,
        ...thirdPlaceFinal.matches,
        ...final.matches,
      ]);
    }
  }, [
    final.matches,
    groupOf16.matches,
    groupOf8.matches,
    semiFinals.matches,
    setFinalsMatches,
    thirdPlaceFinal.matches,
  ]);

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

  const handleSetGoalscorer = (goalscorer) => {
    setGoalscorer(goalscorer);
  };

  return (
    <div>
      {mode !== "placedBet" && (
        <Container classNames="mx-auto w-[300px] md:w-[500px] flex flex-col space-y-3 ">
          <h1 className="text-center text-xl">
            Lägg tips för Världsmästerskapet i fotboll 2022
          </h1>
        </Container>
      )}
      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] mx-1 lg:flex lg:justify-center">
        <div className="lg:justify-end">
          {championship.matchGroups.map((group) => (
            <MatchGroup
              group={group}
              key={group.name}
              matchInfos={championship.matchInfos}
              mode={mode}
            />
          ))}
          <MatchGroup
            group={groupOf16}
            matchInfos={championship.matchInfos}
            mode={mode}
          />
          <MatchGroup
            group={groupOf8}
            matchInfos={championship.matchInfos}
            mode={mode}
          />
          <MatchGroup
            group={semiFinals}
            matchInfos={championship.matchInfos}
            mode={mode}
          />
          <MatchGroup
            group={thirdPlaceFinal}
            matchInfos={championship.matchInfos}
            mode={mode}
          />
          <MatchGroup
            group={final}
            matchInfos={championship.matchInfos}
            mode={mode}
          />
          <GoalscorerInput
            goalscorer={goalscorer}
            handleSetGoalscorer={handleSetGoalscorer}
            mode={mode}
          />
          {mode !== "placedBet" && (
            <div className="flex mb-10 mt-4">
              {bettingAllowed ? (
                <SubmitButton type="button" onClick={handleSave}>
                  Spara tips
                </SubmitButton>
              ) : (
                <div className="rounded-lg my-3 py-1 px-2 ml-3  text-red-500 font-bold">
                  Det är inte längre tillåtet att uppdatera ditt tips.
                </div>
              )}
            </div>
          )}
        </div>
        <div className="max-w-[500px] lg:max-w-[450px] lg:justify-start ">
          <GroupBoard mode={mode} />
          {mode === "betslip" && <TiebreakerInfo />}
        </div>
      </div>
    </div>
  );
};

export default BetSlip;
