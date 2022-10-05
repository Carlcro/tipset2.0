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

  const secondToLastGameHighscoreData = userTournament.members
    .sort((a, b) => b.points - a.points)
    .map((x) => {
      const points = x?.betSlip?.points;

      let secondToLastPoint;
      if (points && points.length >= 2) {
        secondToLastPoint = points[points.length - 2];
      } else {
        secondToLastPoint = "-";
      }
      return {
        id: x._id.toString(),
        fullName: x.fullName,
        points: secondToLastPoint,
      };
    });

  const highscoreData = userTournament.members
    .sort((a, b) => b.points - a.points)
    .map((x) => {
      const points = x?.betSlip?.points;

      let lastPoints;
      if (points) {
        lastPoints = points[points.length - 1];
      } else {
        lastPoints = "-";
      }
      return {
        id: x._id.toString(),
        fullName: x.fullName,
        points: lastPoints,
      };
    });

  const data = highscoreData.map((x, index) => {
    const indexLast = secondToLastGameHighscoreData.findIndex(
      (y) => y.id === x.id
    );

    const difference = indexLast - index;

    return {
      id: x.id,
      fullName: x.fullName,
      points: x.points.points,
      difference,
    };
  });

  res.send(data);
};
