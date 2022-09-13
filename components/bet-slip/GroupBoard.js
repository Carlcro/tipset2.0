import React from "react";
import Group from "./Group";
import { useRecoilValue } from "recoil";
import { getSortedGroupResults } from "../../recoil/bet-slip/selectors/results";

export default function GroupBoard() {
  const groupResults = useRecoilValue(getSortedGroupResults);

  return (
    <div>
      {groupResults.map((groupResult) => (
        <Group
          key={groupResult.name}
          points={groupResult.points}
          groupName={groupResult.name}
          groupResult={groupResult.results}
        />
      ))}
    </div>
  );
}
