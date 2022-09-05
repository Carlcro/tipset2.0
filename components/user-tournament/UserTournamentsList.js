import Link from "next/link";
import { useQuery } from "react-query";
import { getAllUserTournaments } from "../../services/userTournamentService";
import Spinner from "../Spinner";

const UserTournamentsList = () => {
  const { data, isLoading } = useQuery("userTournaments", async () => {
    const { data } = await getAllUserTournaments();

    return data;
  });

  return (
    <div className="rounded-sm shadow-lg p-3 bg-white">
      <div className="text-black font-semibold">Dina grupper</div>
      {isLoading ? (
        <Spinner />
      ) : (
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
      )}
    </div>
  );
};

export default UserTournamentsList;
