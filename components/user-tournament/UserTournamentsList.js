import Link from "next/link";

const UserTournamentsList = ({ tournaments }) => {
  return (
    <div className="rounded-sm shadow-lg p-3 bg-white">
      <div className="text-black font-bold">Dina grupper</div>
      <ul>
        {tournaments.map((tournament) => (
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
