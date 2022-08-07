import Link from "next/link";

const HighScoreTable = ({ highscoreData }) => {
  return (
    <div className="flex justify-center">
      <div className="bg-white rounded-sm p-3 w-[500px]">
        <h2 className="font-semibold">Topplistan</h2>
        <table className="table-fixed w-full">
          <thead>
            <tr className="table-fixed">
              <th className="w-1/8">Rank</th>
              <th className="w-3/4 text-left">Namn</th>
              <th className="w-1/8">Poäng</th>
            </tr>
          </thead>
          <tbody>
            {highscoreData.map((score, index) => (
              <tr
                className={
                  index % 2 === 0
                    ? "bg-gray-100 border-b-2 border-black"
                    : "border-b-2 border-black"
                }
                key={score.id}
              >
                <td className="text-center">{index + 1}</td>
                <td className="text-left">
                  <Link href={`/placed-bets/${score.id}`}>
                    <a>{score.fullName}</a>
                  </Link>
                </td>
                <td className="text-center">{score.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HighScoreTable;
