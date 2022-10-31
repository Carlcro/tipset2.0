import Link from "next/link";
import { motion } from "framer-motion";
import DiffIndicator from "../../components/DiffIndicator";
import Container from "../Container";

const HighScoreTable = ({ highscoreData, name }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Container classNames="w-[400px]">
        <h2 className="font-semibold text-xl text-center">
          {name ? name : "Topplistan"}
        </h2>
        <table className="mx-1 w-full">
          <thead>
            <tr>
              <th>Rank</th>
              <th className="text-center md:text-left">Namn</th>
              <th>Poäng</th>
              <th className="w-12">{""}</th>
            </tr>
          </thead>
          <tbody>
            {highscoreData.map((score, index) => (
              <tr
                className={
                  index % 2 === 0
                    ? "bg-gray-100 border-b-2 border-polarNight"
                    : "border-b-2 border-polarNight"
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
                <td className="text-center">
                  {score.difference ? (
                    <div className="justify-around my-2 absolute">
                      <span
                        className={
                          score.difference < 0
                            ? "relative left-4 top-[-23px] text-xs"
                            : "relative left-4 top-[-17px] text-xs"
                        }
                      >
                        {Math.abs(score.difference)}
                      </span>
                      <div
                        className={
                          score.difference < 0
                            ? "relative left-[14px] top-[-34px]"
                            : "relative left-[18.5px] top-[-48px]"
                        }
                      >
                        <div
                          className={
                            score.difference < 0
                              ? "rotate-180 fill-red-600"
                              : "fill-green-600"
                          }
                        >
                          <DiffIndicator hight={20} width={20} />
                        </div>
                      </div>
                    </div>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Container>
    </motion.div>
  );
};

export default HighScoreTable;
