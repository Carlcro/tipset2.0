import React from "react";
import UserTournamentForm from "../../components/user-tournament/UserTournamentForm";
import UserTournamentsList from "../../components/user-tournament/UserTournamentsList";
import { useQuery } from "react-query";
import { getAllUserTournaments } from "../../services/userTournamentService";

const UserTournamentContainer = () => {
  const { data } = useQuery("userTournaments", async () => {
    const { data } = await getAllUserTournaments();
    return data;
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 px-5">
      <div>
        <UserTournamentsList tournaments={data} />
      </div>
      <div>
        <UserTournamentForm />
      </div>
    </div>
  );
};

/* export async function getServerSideProps(context) {
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

  return { props: { tournaments } };
}
 */
export default UserTournamentContainer;
