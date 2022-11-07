import { useQuery } from "react-query";
import { useSetRecoilState } from "recoil";
import { setFromBetslipState } from "../../recoil/bet-slip/selectors/selectors";
import { getAnswerSheet } from "../../services/championshipService";
import dynamic from "next/dynamic";
import Container from "../../components/Container";

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
      <Container classNames="mx-auto w-64 flex justify-center">
        <h1 className="text-lg">Facit</h1>
      </Container>
      <DynamicBetslip mode={"placedBet"}></DynamicBetslip>;
    </div>
  );
};

export default Championship;
