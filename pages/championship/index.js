import { useQuery } from "react-query";
import { useSetRecoilState } from "recoil";
import { setFromBetslipState } from "../../recoil/bet-slip/selectors/selectors";
import BetSlip from "../bet-slip/components/BetSlip";
import { getAnswerSheet } from "../../services/championshipService";

const Championship = () => {
  const setFromBetslip = useSetRecoilState(setFromBetslipState);

  useQuery("answerSheet", async () => {
    const { data } = await getAnswerSheet();
    if (data) {
      setFromBetslip({
        goalscorer: data.goalscorer ? data.goalscorer?.player : undefined,
        bets: [...data.results],
      });
      if (data.goalscorer) {
        setGoals(data.goalscorer.goals);
      }
    }
  });

  return (
    <div className="pb-10">
      <div className="bg-white rounded-sm mx-auto px-3 py-5 w-64 flex justify-center">
        <h1 className="text-lg">Mästerskap</h1>
      </div>
      <BetSlip mode={"placedBet"}></BetSlip>;
    </div>
  );
};

export default Championship;
