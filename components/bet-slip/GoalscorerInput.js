import React from "react";
import { useRecoilValue } from "recoil";
import {
  goalscorerState,
  pointsFromGoalscorerState,
} from "../../recoil/bet-slip/atoms";
import Auto from "./Auto";

function GoalscorerInput({ goalscorer, handleSetGoalscorer, mode }) {
  const points = useRecoilValue(pointsFromGoalscorerState);

  return (
    <div className="rounded-sm px-2 py-2 bg-white">
      <h2 className="font-semibold mb-1">Skyttekung</h2>
      {mode !== "placedBet" ? (
        <Auto
          mode={mode}
          goalscorer={goalscorer}
          setGoalscorer={handleSetGoalscorer}
        />
      ) : (
        <div className="flex justify-between">
          <span>{goalscorer?.name}</span>
          {points !== undefined && <span>{`Poäng: ${points}`}</span>}
        </div>
      )}
    </div>
  );
}

export default GoalscorerInput;
