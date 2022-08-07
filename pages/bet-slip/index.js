import React, { useState } from "react";
import { queryCache, useMutation, useQuery } from "react-query";
import { createBetSlip, getBetSlip } from "../../services/betSlipService";
import { toast } from "react-toastify";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { setFromBetslipState } from "./recoil/selectors/selectors";
import { betSlipState, goalscorerState } from "./recoil/atoms";

import BetSlip from "./components/BetSlip";

const BetSlipContainer = () => {
  const setFromBetslip = useSetRecoilState(setFromBetslipState);
  const goalscorer = useRecoilValue(goalscorerState);
  const betslip = useRecoilValue(betSlipState);
  const [error, setError] = useState(false);

  useQuery(
    "betslip",
    async () => {
      const { data } = await getBetSlip();
      if (data) {
        setFromBetslip(data);
      }
    },
    {
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  );

  const mutation = useMutation(createBetSlip, {
    onSuccess: ({ data }) => {
      queryCache.setQueryData("user", (old) => ({
        ...old,
        betslip: data._id,
      }));
      queryCache.setQueryData("betslip", data);
      setFromBetslip(data);

      toast.success(
        "Ditt tips är sparat! Du kan fortsätta göra ändringar fram till 20:00 Torsdagen den 10/6",
        { autoClose: 10000 }
      );
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const isValidBet = () => {
    if (betslip.length !== 51) {
      setError("Alla matcher måste vara ifyllda");
      return false;
    }

    if (betslip.some((bet) => bet.team1Score === "" || bet.team2Score === "")) {
      setError("Alla matcher måste vara ifyllda");
      return false;
    }

    if (
      betslip[50].team1Score === betslip[50].team2Score &&
      !betslip[50].penaltyWinner
    ) {
      setError("Alla matcher måste vara ifyllda");
      return false;
    }

    if (!goalscorer) {
      setError("Skyttekung saknas");
      return false;
    }
    return true;
  };

  const submitBet = () => {
    if (isValidBet()) {
      mutation.mutate({
        bets: betslip.map((matchResult) => {
          return matchResult.penaltyWinner
            ? Object.assign({}, matchResult, {
                team1: matchResult.team1._id,
                team2: matchResult.team2._id,
                penaltyWinner: matchResult.penaltyWinner._id,
              })
            : Object.assign({}, matchResult, {
                team1: matchResult.team1._id,
                team2: matchResult.team2._id,
              });
        }),
        goalscorer: goalscorer !== undefined ? goalscorer._id : undefined,
      });
    }
  };

  return (
    <BetSlip
      bettingAllowed={true}
      handleSave={submitBet}
      mode={"betslip"}
      error={error}
    />
  );
};

export default BetSlipContainer;
