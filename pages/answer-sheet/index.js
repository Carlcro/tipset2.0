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
import { updateBetSlip } from "../../services/betSlipService";

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

  const [finalsMatches, setFinalsMatches] = useState([]);

  const [calculateAllPoints, setCalculateAllPoints] = useState(false);

  const handleChange = () => {
    setCalculateAllPoints(!calculateAllPoints);
  };

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
      refetchOnWindowFocus: false,
      retry: false,
      onError: () => {
        setBetslip([]);
        setGoalscorer(null);
      },
      retry: false,
    }
  );

  const mutation = useMutation(saveAnswerSheet, {
    onSuccess: () => {
      updateBetSlips();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateBetSlips = async () => {
    const skip = 0;
    const batchSize = 10;
    const iterations = Math.ceil(294 / batchSize);

    for (let index = 0; index < iterations; index++) {
      await updateBetSlip(skip, batchSize, calculateAllPoints, password);
      skip = skip + batchSize;
      toast.success(`${iterations - index - 1} sparningar kvar`);
    }
  };

  const submitAnswer = async () => {
    const finalsNotPlayed = finalsMatches.filter(
      (x) => x.matchId > betslip.length
    );

    mutation.mutate({
      answerSheet: {
        answers: [...betslip, ...finalsNotPlayed].map((matchResult) =>
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
        setFinalsMatches={setFinalsMatches}
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
        <label>
          <input type="checkbox" onChange={handleChange} />
          Räkna ut ALLA poäng
        </label>
      </div>
    </>
  );
};
export default AnswerSheet;
