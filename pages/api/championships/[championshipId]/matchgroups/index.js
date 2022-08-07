import MatchGroup from "../../../../../models/match-group";
import Championship from "../../../../../models/championship";
import Team from "../../../../../models/team";
import { matchGroupSchema } from "../../../../../validation/match-group-schema";

const createMatchGroup = async (req, res, championshipId) => {
  const { error } = matchGroupSchema.validate(req.body);

  if (error)
    return res.status(500).send(error.details.map((e) => e.message).join("\n"));

  const matchGroup = new MatchGroup({
    name: req.body.name,
    teams: req.body.teams,
    matches: [],
  });

  for (const id of req.body.teams) {
    await Team.findByIdAndUpdate(id, {
      group: req.body.name,
    });
  }

  const newMatchGroup = await matchGroup.save();

  const championship = await Championship.findById(championshipId);
  championship.matchGroups.push(newMatchGroup._id);
  await championship.save();

  res.send(newMatchGroup);
};

export default function handler(req, res) {
  const { championshipId } = req.query;
  if (req.method === "POST") {
    return createMatchGroup(req, res, championshipId);
  } else if (req.method === "GET") {
    console.log("hej");
  }
}
