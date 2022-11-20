import { useQuery } from "react-query";
import { useSetRecoilState } from "recoil";
import { setFromBetslipState } from "../../recoil/bet-slip/selectors/selectors";
import { getAnswerSheet } from "../../services/championshipService";
import dynamic from "next/dynamic";
import Container from "../../components/Container";
import { motion } from "framer-motion";
import { getConfig } from "../../services/configService";

const DynamicBetslip = dynamic(
  () => import("../../components/bet-slip/BetSlip"),
  {
    ssr: false,
  }
);
const Championship = () => {
  const setFromBetslip = useSetRecoilState(setFromBetslipState);

  useQuery(
    ["answerSheet"],
    async () => {
      const { data } = await getAnswerSheet();
      if (data) {
        setFromBetslip({
          goalscorer: data.goalscorer?.player,
          bets: [...data.results],
        });
      }
    },
    {
      onError: () => {
        setFromBetslip({
          goalscorer: "",
          bets: [],
        });
      },
      retry: false,
    }
  );

  return (
    <div className="pb-10">
      <DynamicBetslip headerText={"Facit"} mode={"placedBet"}></DynamicBetslip>;
    </div>
  );
};

export default Championship;
