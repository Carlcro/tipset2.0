import React from "react";
import UserTournament from "../../models/user-tournament";
import { useQuery } from "react-query";
import { getHighscore } from "../../services/userTournamentService";
import { useRouter } from "next/router";
import HighScoreTable from "./components/HighScoreTable";
import { useState } from "react";
import dynamic from "next/dynamic";

const DynamicUserTournamentPanel = dynamic(
  () => import("./components/UserTournamentPanel"),
  {
    ssr: false,
  }
);

const UserTournamentPage = ({ highscoreData }) => {
  const router = useRouter();
  const { id } = router.query;
  const query = useQuery(["highscoreData", id], () => getHighscore(id), {
    initialData: highscoreData,
  });

  return (
    <div className="flex space-x-8 px-5">
      <DynamicUserTournamentPanel />
      <HighScoreTable highscoreData={query.data} />
    </div>
  );
};

export default UserTournamentPage;

export async function getServerSideProps({ params }) {
  const userTournament = await UserTournament.findById(params.id).populate({
    path: "members",
    populate: [{ path: "betSlip" }],
  });

  const highscoreData = userTournament.members
    .sort((a, b) => b.points - a.points)
    .map((x) => ({
      id: x._id.toString(),
      fullName: x.fullName,
      points: x.betSlip.points || 0,
    }));

  return {
    props: {
      highscoreData,
    },
  };
}
