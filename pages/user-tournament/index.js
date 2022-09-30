import React from "react";
import UserTournamentForm from "../../components/user-tournament/UserTournamentForm";
import UserTournamentsList from "../../components/user-tournament/UserTournamentsList";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import User from "../../models/user";

const UserTournamentContainer = ({ fullName }) => {
  /*   const { data } = useQuery(
    "userTournaments",
    async () => {
      const { data } = await getAllUserTournaments();
      return data;
    },
    { initialData: tournaments }
  ); */

  return <div>{fullName}</div>;

  /*   return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 px-5">
      <div>
        <UserTournamentsList tournaments={tournaments} />
      </div>
      <div>
        <UserTournamentForm />
      </div>
    </div>
  ); */
};

export async function getServerSideProps(context) {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );
  const user = await User.findOne({ email: session?.user.email });

  console.log("userLOL", user);

  /* const userTournaments = await UserTournament.find({
    members: { $in: user._id },
  });

  console.log("userTournamentsLOL", userTournaments);

  const tournaments = userTournaments.map((x) => ({
    _id: x._id.toString(),
    name: x.name,
  }));
 */
  return { props: { fullName: user.fullName } };
}

export default UserTournamentContainer;
