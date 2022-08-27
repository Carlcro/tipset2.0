import connectDB from "../../../middleware/mongodb";
import Team from "../../../models/team";

const getTeam = async (req, res, teamId) => {
  const team = await Team.findById(teamId);

  res.send(team);
};

function handler(req, res) {
  const { teamId } = req.query;

  if (req.method === "GET") {
    return getTeam(re, res, teamId);
  }
}

export default connectDB(handler);
