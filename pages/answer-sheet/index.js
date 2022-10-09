import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  getAnswerSheet,
  saveAnswerSheet,
} from "../../services/championshipService";
import { betSlipState, goalscorerState } from "../../recoil/bet-slip/atoms";
import { setFromBetslipState } from "../../recoil/bet-slip/selectors/selectors";
import dynamic from "next/dynamic";
import { toast } from "react-toastify";

const DynamicBetslip = dynamic(
  () => import("../../components/bet-slip/BetSlip"),
  {
    ssr: false,
  }
);

const AnswerSheet = () => {
  const setFromBetslip = useSetRecoilState(setFromBetslipState);
  const [password, setPassword] = useState("");
  const [goals, setGoals] = useState(0);
  const [betslip, setBetslip] = useRecoilState(betSlipState);
  const [goalscorer, setGoalscorer] = useRecoilState(goalscorerState);

  const queryClient = useQueryClient();

  useQuery(
    "answerSheet",
    async () => {
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
    },
    {
      onError: () => {
        setBetslip([]);
        setGoalscorer(null);
      },
      retry: false,
    }
  );

  const mutation = useMutation(saveAnswerSheet, {
    onSuccess: () => {
      queryClient.invalidateQueries(["answerSheet"]);
      toast.success("Sparat!");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const submitAnswer = () => {
    mutation.mutate({
      answerSheet: {
        answers: betslip.map((matchResult) =>
          Object.assign({}, matchResult, {
            team1: matchResult.team1._id,
            team2: matchResult.team2._id,
          })
        ),
        goalscorer: { ...goalscorer, goals },
      },
      password,
    });
  };

  return (
    <>
      <div className="flex justify-center mb-4">
        <h1 className="text-3xl font-bold">Answer Sheet</h1>
      </div>
      <DynamicBetslip
        bettingAllowed={true}
        handleSave={submitAnswer}
        mode={"answerSheet"}
      ></DynamicBetslip>
      <div className="flex space-x-4 pb-10 pl-20 ">
        <input
          className="rounded-sm px-2 py-2"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="text"
        ></input>
        <input
          className="rounded-sm px-2 py-2 "
          type="number"
          placeholder="Number of goals"
          value={goals}
          onChange={(e) => setGoals(e.target.value)}
        ></input>
      </div>
    </>
  );
};
export default AnswerSheet;
