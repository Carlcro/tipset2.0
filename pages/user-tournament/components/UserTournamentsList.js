import Link from "next/link";
import { useQuery } from "react-query";
import { getAllUserTournaments } from "../../../services/userTournamentService";

const UserTournamentsList = () => {
  const { data = [] } = useQuery("userTournaments", async () => {
    const { data } = await getAllUserTournaments();

    return data;
  });

  return (
    <div className="rounded-sm shadow-lg p-3 bg-white">
      <div className="text-black font-semibold">Dina grupper</div>
      <ul>
        {data.map((tournament) => (
          <li key={tournament._id}>
            <Link
              className="text-black"
              href={`/user-tournament-page/${tournament._id}`}
            >
              <a>{tournament.name}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserTournamentsList;
