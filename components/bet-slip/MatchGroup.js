import React from "react";
import { useRecoilValue } from "recoil";
import { getPointsFromAdvancement } from "../../recoil/bet-slip/selectors/selectors";
import Match from "../Match";

function MatchGroup(group, matchInfos, mode) {
  const points = useRecoilValue(getPointsFromAdvancement(group.name));

  const matchIds = group.matches.map((m) => m.matchId);

  const matchInfosForGroup = matchInfos
    .filter((mi) => matchIds.includes(mi.matchId))
    .sort((a, b) => b.time - a.time);

  return (
    <div
      className="shadow-md my-2 rounded-sm p-2 lg:w-full bg-white"
      key={group.name}
    >
      <div className="flex justify-between">
        <h2 className="font-semibold text-xl pl-2 pb-1">{`${
          group.finalsStage ? "" : "Grupp"
        } ${group.name}`}</h2>
        {points !== null ? (
          <div className="flex justify-between">
            {`Poäng rätt lag vidare: ${points}`}
          </div>
        ) : (
          <div />
        )}
      </div>
      {matchInfosForGroup.map((matchInfo) => {
        const match = group.matches.find(
          (match) => matchInfo.matchId === match.matchId
        );
        return (
          <Match
            key={match.team1.name + match.team2.name}
            match={match}
            matchInfo={matchInfo}
            finalsStage={group.finalsStage}
            mode={mode}
          />
        );
      })}
    </div>
  );
}

export default MatchGroup;
