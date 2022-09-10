import React, { useEffect, useState } from "react";
import { queryCache, useMutation, useQuery } from "react-query";
import { createBetSlip, getBetSlip } from "../../services/betSlipService";
import { toast } from "react-toastify";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { setFromBetslipState } from "../../recoil/bet-slip/selectors/selectors";
import { betSlipState, goalscorerState } from "../../recoil/bet-slip/atoms";
import { useSession } from "next-auth/react";

import dynamic from "next/dynamic";
import { useRouter } from "next/router";

const DynamicBetslip = dynamic(
  () => import("../../components/bet-slip/BetSlip"),
  {
    ssr: false,
  }
);

const BetSlipContainer = () => {
  const setFromBetslip = useSetRecoilState(setFromBetslipState);
  const goalscorer = useRecoilValue(goalscorerState);
  const betslip = useRecoilValue(betSlipState);

  const { status } = useSession();
  const router = useRouter();

  const errorToast = (message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

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

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signIn");
    }
  }, [status, router]);

  const mutation = useMutation(createBetSlip, {
    onSuccess: ({ data }) => {
      queryCache.setQueryData("user", (old) => ({
        ...old,
        betslip: data._id,
      }));
      queryCache.setQueryData("betslip", data);
      setFromBetslip(data);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const isValidBet = () => {
    if (betslip.length !== 63) {
      errorToast("Alla matcher måste vara ifyllda");
      return false;
    }

    if (betslip.some((bet) => bet.team1Score === "" || bet.team2Score === "")) {
      errorToast("Alla matcher måste vara ifyllda");
      return false;
    }

    if (
      betslip[62].team1Score === betslip[62].team2Score &&
      !betslip[62].penaltyWinner
    ) {
      errorToast("Alla matcher måste vara ifyllda");
      return false;
    }

    if (!goalscorer) {
      errorToast("Skyttekung saknas");
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
      toast.success("Spel sparat!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <DynamicBetslip
      bettingAllowed={true}
      handleSave={submitBet}
      mode={"betslip"}
    />
  );
};

export default BetSlipContainer;
