import React from "react";
import { useQuery } from "react-query";

import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import HighScoreTable from "../../components/user-tournament-page/HighScoreTable";
import { getHighscore } from "../../services/userTournamentService";
import Spinner from "../../components/Spinner";
import UserTournament from "../../models/user-tournament";

const DynamicUserTournamentPanel = dynamic(
  () => import("../../components/user-tournament-page/UserTournamentPanel"),
  {
    ssr: false,
  }
);

const UserTournamentPage = ({ highscoreData }) => {
  return (
    <div className="flex flex-col-reverse md:flex-row md:space-x-8 px-5 items-center md:items-start">
      <DynamicUserTournamentPanel />
      <HighScoreTable highscoreData={highscoreData} />
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
      points: x?.betSlip?.points || "-",
    }));

  return {
    props: {
      highscoreData,
    },
  };
}
