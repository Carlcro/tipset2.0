import Team from "../../../models/team";

const getTeam = async (req, res, teamId) => {
  const team = await Team.findById(teamId);

  res.send(team);
};

export default function handler(req, res) {
  const { teamId } = req.query;

  if (req.method === "GET") {
    return getTeam(re, res, teamId);
  }
}
