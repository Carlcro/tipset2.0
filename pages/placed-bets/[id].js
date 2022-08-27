import { useQuery } from "react-query";
import { useSetRecoilState } from "recoil";
import { setFromBetslipState } from "../../recoil/bet-slip/selectors/selectors";
import { getPlacedBet } from "../../services/placedBetService";
import BetSlip from "../../components/bet-slip/BetSlip";
import { useRouter } from "next/router";
import { useState } from "react";

import dynamic from "next/dynamic";

const DynamicBetslip = dynamic(
  () => import("../../components/bet-slip/BetSlip"),
  {
    ssr: false,
  }
);

const PlacedBets = () => {
  const setFromBetslip = useSetRecoilState(setFromBetslipState);
  const [name, setName] = useState("");

  const router = useRouter();
  const { id } = router.query;

  useQuery(["placedBets", id], async () => {
    const { data } = await getPlacedBet(id);
    if (data) {
      setFromBetslip({
        goalscorer: data.betSlip.goalscorer
          ? data.betSlip.goalscorer
          : undefined,
        bets: [...data.betSlip.bets],
      });
      setName(data.name);
    }
  });
  return (
    <div className="pb-10">
      <div className="bg-white rounded-sm mx-auto px-3 py-5 w-64 flex justify-center">
        <h1 className="text-lg">{name}</h1>
      </div>
      <DynamicBetslip bettingAllowed={true} mode={"placedBet"}></DynamicBetslip>
      ;
    </div>
  );
};

export default PlacedBets;
