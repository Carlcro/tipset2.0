import React, { useState } from "react";
import { useQuery } from "react-query";

import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import HighScoreTable from "../../components/user-tournament-page/HighScoreTable";
import { getHighscore } from "../../services/userTournamentService";
import UserTournament from "../../models/user-tournament";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import User from "../../models/user";
import KickMemberDialog from "../../components/user-tournament-page/KickMemberDialog";

const DynamicUserTournamentPanel = dynamic(
  () => import("../../components/user-tournament-page/UserTournamentPanel"),
  {
    ssr: false,
  }
);

const UserTournamentPage = ({ highscoreData, isOwner, name }) => {
  const router = useRouter();

  const { id } = router.query;
  const [kickMemberDialogOpen, setKickMemberDialogOpen] = useState(false);
  const [memberEmail, setMemberEmail] = useState("");
  const [memberName, setMemberName] = useState("");

  const { data } = useQuery(
    ["highscoreData", id],
    () => getHighscore(id),

    { initialData: highscoreData, enabled: Boolean(id) }
  );

  const handleKick = (email, name) => {
    setMemberEmail(email);
    setMemberName(name);
    setKickMemberDialogOpen(true);
  };

  return (
    <div className="flex flex-col-reverse md:flex-row md:space-x-8 px-5 items-center md:items-start md:justify-center">
      <DynamicUserTournamentPanel isOwner={isOwner} />
      <HighScoreTable
        handleKick={handleKick}
        isOwner={isOwner}
        name={name}
        highscoreData={data}
      />
      <KickMemberDialog
        isOpen={kickMemberDialogOpen}
        setIsOpen={setKickMemberDialogOpen}
        memberEmail={memberEmail}
        memberName={memberName}
      />
    </div>
  );
};

export default UserTournamentPage;

export async function getServerSideProps({ params, res, req }) {
  const session = await unstable_getServerSession(req, res, authOptions);
  const user = await User.findOne({ email: session?.user.email });
  const userTournament = await UserTournament.findById(params.id).populate({
    path: "members",
    populate: [{ path: "betSlip" }],
  });

  const isOwner = user._id.equals(userTournament.owner);

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

  return {
    props: {
      isOwner,
      highscoreData: data,
      name: userTournament.name,
    },
  };
}
