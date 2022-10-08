import connectDB from "../../../../middleware/mongodb";
import UserTournament from "../../../../models/user-tournament";

function handler(req, res) {
  if (req.method === "GET") {
    return getHighScore(req, res);
  }
}

export default connectDB(handler);

const getHighScore = async (req, res) => {
  const { id } = req.query;

  const userTournament = await UserTournament.findById(id).populate({
    path: "members",
    populate: [{ path: "betSlip" }],
  });

  const highscoreData = userTournament.members.map((x) => ({
    id: x._id.toString(),
    fullName: x.fullName,
    points: x?.betSlip?.points || null,
  }));

  const sorted = highscoreData.sort((a, b) => {
    return b.points - a.points;
  });

  res.send(sorted);
};
