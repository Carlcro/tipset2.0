import Match from "../../../../../models/match";
import MatchGroup from "../../../../../models/match-group";
import { matchSchema } from "../../../../../validation/match-schema";

const createMatch = async (req, res, matchGroupId) => {
  const { error } = matchSchema.validate(req.body);

  if (error)
    return res.status(500).send(error.details.map((e) => e.message).join("\n"));

  const match = new Match({
    matchId: req.body.matchId,
    team1: req.body.team1,
    team2: req.body.team2,
  });
  const newMatch = await match.save();

  const matchGroup = await MatchGroup.findById(matchGroupId);
  matchGroup.matches.push(newMatch._id);
  await matchGroup.save();

  res.send(newMatch);
};

export default function handler(req, res) {
  const { matchGroupId } = req.query;
  if (req.method === "POST") {
    return createMatch(req, res, matchGroupId);
  }
}

