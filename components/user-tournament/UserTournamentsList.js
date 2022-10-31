import { motion } from "framer-motion";
import Link from "next/link";
import Container from "../Container";

const UserTournamentsList = ({ tournaments }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Container>
        <div className="text-black font-bold">Dina grupper</div>
        <ul>
          {tournaments?.map((tournament) => (
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
      </Container>
    </motion.div>
  );
};

export default UserTournamentsList;
