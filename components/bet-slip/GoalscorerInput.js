import React from "react";
import Auto from "./Auto";

function GoalscorerInput({ goalscorer, handleSetGoalscorer, mode }) {
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
        <span>{goalscorer?.name}</span>
      )}
    </div>
  );
}

export default GoalscorerInput;
