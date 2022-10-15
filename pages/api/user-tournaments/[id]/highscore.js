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

  const getHighscore = (x, index) => {
    const pointsArray = x?.betSlip?.pointsArray;

    let secondToLastPoint;
    if (pointsArray && pointsArray.length >= index) {
      secondToLastPoint = pointsArray[pointsArray.length - index];
    } else {
      secondToLastPoint = "-";
    }
    return {
      id: x._id.toString(),
      fullName: x.fullName,
      points: secondToLastPoint.points || null,
    };
  };

  const secondToLastGameHighscoreData = userTournament.members
    .map((x) => getHighscore(x, 2))
    .sort((a, b) => b.points - a.points);

  const highscoreData = userTournament.members
    .map((x) => getHighscore(x, 1))
    .sort((a, b) => b.points - a.points);

  const data = highscoreData.map((x, index) => {
    const lastRank = secondToLastGameHighscoreData.findIndex(
      (y) => y.id === x.id
    );

    const difference = lastRank - index;

    return {
      id: x.id,
      fullName: x.fullName,
      points: x.points,
      difference,
    };
  });

  res.send(data);
};
