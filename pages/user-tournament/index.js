import React from "react";
import UserTournamentForm from "../../components/user-tournament/UserTournamentForm";
import UserTournamentsList from "../../components/user-tournament/UserTournamentsList";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import User from "../../models/user";
import mongoose from "mongoose";
import { useQuery } from "react-query";
import UserTournament from "../../models/user-tournament";
import { getAllUserTournaments } from "../../services/userTournamentService";
import Config from "../../models/config";
import HighScoreTable from "../../components/user-tournament-page/HighScoreTable";

const UserTournamentContainer = ({ tournaments, highscoreData }) => {
  const { data } = useQuery(
    "userTournaments",
    async () => {
      const { data } = await getAllUserTournaments();
      return data;
    },
    { initialData: tournaments }
  );

  return (
    <div className="flex flex-col-reverse md:flex-row md:space-x-8 px-5 items-center md:items-start md:justify-center">
      <div className="space-y-5  w-full max-w-[400px] mt-5 md:mt-0">
        <UserTournamentsList tournaments={data} />
        <UserTournamentForm />
      </div>
      <HighScoreTable highscoreData={highscoreData} />
    </div>
  );
};

export async function getServerSideProps(context) {
  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
  // Use new db connection
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );
  const user = await User.findOne({ email: session?.user.email });

  const userTournaments = await UserTournament.find({
    members: { $in: user._id },
  });

  const tournaments = userTournaments.map((x) => ({
    _id: x._id.toString(),
    name: x.name,
  }));

  const config = await Config.findOne();

  const userTournament = await UserTournament.findById(
    config.autoJoinUserTournamentId
  ).populate({
    path: "members",
    populate: [{ path: "betSlip" }],
  });

  const getHighscore = (x, index) => {
    const pointsArray = x?.betSlip?.pointsArray;

    let secondToLastPoint;
    if (pointsArray && pointsArray.length >= index) {
      secondToLastPoint = pointsArray[pointsArray.length - index];
    }
    return {
      id: x._id.toString(),
      fullName: x.fullName,
      points: secondToLastPoint?.points || null,
      email: x.email || null,
    };
  };

  const secondToLastGameHighscoreData = userTournament.members
    .map((x) => getHighscore(x, 2))
    .sort((a, b) => b.points - a.points);

  const highscoreData = userTournament.members
    .map((x) => getHighscore(x, 1))
    .sort((a, b) => b.points - a.points);

  const data = highscoreData.map((x, index) => {
    const lastRank = secondToLastGameHighscoreData.findIndex(
      (y) => y.id === x.id
    );

    const difference = x.points !== null ? lastRank - index : null;

    return {
      id: x.id,
      fullName: x.fullName,
      points: x.points,
      email: x.email,
      difference,
    };
  });

  return { props: { tournaments, highscoreData: data } };
}

export default UserTournamentContainer;
