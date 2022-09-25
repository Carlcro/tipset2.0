import { useQuery } from "react-query";
import { useSetRecoilState } from "recoil";
import { setFromBetslipState } from "../../recoil/bet-slip/selectors/selectors";
import { getAnswerSheet } from "../../services/championshipService";
import dynamic from "next/dynamic";

const DynamicBetslip = dynamic(
  () => import("../../components/bet-slip/BetSlip"),
  {
    ssr: false,
  }
);
const Championship = () => {
  const setFromBetslip = useSetRecoilState(setFromBetslipState);

  useQuery(["answerSheet"], async () => {
    const { data } = await getAnswerSheet();
    if (data) {
      setFromBetslip({
        goalscorer: data.goalscorer?.player,
        bets: [...data.results],
      });
    }
  });

  return (
    <div className="pb-10">
      <div className="bg-white rounded-sm mx-auto px-3 py-5 w-64 flex justify-center">
        <h1 className="text-lg">Mästerskap</h1>
      </div>
      <DynamicBetslip mode={"placedBet"}></DynamicBetslip>;
    </div>
  );
};

export default Championship;
