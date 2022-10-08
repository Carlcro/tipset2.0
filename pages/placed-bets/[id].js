import { useQuery } from "react-query";
import { useSetRecoilState } from "recoil";
import { setFromBetslipState } from "../../recoil/bet-slip/selectors/selectors";
import { getPlacedBet } from "../../services/placedBetService";
import { useRouter } from "next/router";
import { useState } from "react";
import { motion } from "framer-motion";

import dynamic from "next/dynamic";

const DynamicBetslip = dynamic(
  () => import("../../components/bet-slip/BetSlip"),
  {
    ssr: false,
  }
);

const PlacedBets = () => {
  const setFromBetslip = useSetRecoilState(setFromBetslipState);
  const [placedBet, setPlacedBet] = useState(true);
  const [name, setName] = useState("");
  const router = useRouter();
  const { id } = router.query;

  const { isLoading } = useQuery(
    ["placedBets", id],
    async () => {
      const { data } = await getPlacedBet(id);
      if (data) {
        setFromBetslip(data.betSlip);
        setName(data.name);
      }
    },
    {
      enabled: Boolean(id),
      retry: false,
      onError: () => {
        setPlacedBet(false);
      },
    }
  );

  if (isLoading) {
    return null;
  }

  if (!placedBet) {
    return (
      <div className=" grid place-content-center">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-sm shadow-sm p-6 mt-10 flex flex-col justify-center space-y-5"
        >
          <h2>Användaren har inte lagt något tips</h2>
          <button
            className="text-blue-700 font-bold"
            onClick={() => router.back()}
          >
            Gå tillbaka
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pb-10">
      <div className="bg-white rounded-sm mx-auto px-3 py-5 w-64 flex justify-center">
        <h1 className="text-lg">{name}</h1>
      </div>
      <DynamicBetslip bettingAllowed={true} mode={"placedBet"}></DynamicBetslip>
      )
    </div>
  );
};

export default PlacedBets;
