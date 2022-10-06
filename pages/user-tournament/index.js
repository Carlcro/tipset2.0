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
      <div className="space-y-5">
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

  const highscoreData = userTournament.members
    .sort((a, b) => b.points - a.points)
    .map((x) => ({
      id: x._id.toString(),
      fullName: x.fullName,
      points: x?.betSlip?.points || "-",
    }));

  return { props: { tournaments, highscoreData } };
}

export default UserTournamentContainer;
