import React from "react";
import Group from "./Group";
import { useRecoilValue } from "recoil";
import { getSortedGroupResults } from "../../../recoil/bet-slip/selectors/results";
import { getBestThirds } from "../../../recoil/bet-slip/selectors/matches";

export default function GroupBoard() {
  const groupResults = useRecoilValue(getSortedGroupResults);
  const bestOfThirds = useRecoilValue(getBestThirds);

  return (
    <div>
      {groupResults.map((groupResult) => (
        <Group
          key={groupResult.name}
          groupName={groupResult.name}
          groupResult={groupResult.results}
        />
      ))}
      <Group
        groupName={bestOfThirds.name}
        groupResult={bestOfThirds.results}
      ></Group>
    </div>
  );
}
