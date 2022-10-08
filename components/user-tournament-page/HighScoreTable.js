import Link from "next/link";
import { motion } from "framer-motion";

const HighScoreTable = ({ highscoreData }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-sm p-3 w-full max-w-[400px]"
    >
      <h2 className="font-semibold text-xl text-center">Topplistan</h2>
      <table className="mx-1 w-full">
        <thead>
          <tr>
            <th>Rank</th>
            <th className="text-center md:text-left">Namn</th>
            <th>Poäng</th>
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
              <td className="text-center md:text-left">
                <Link href={`/placed-bets/${score.id}`}>
                  <a>{score.fullName}</a>
                </Link>
              </td>
              <td className="text-center">{score.points || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};

export default HighScoreTable;
