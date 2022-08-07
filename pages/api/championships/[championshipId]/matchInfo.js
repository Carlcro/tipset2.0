import MatchInfo from "../../../../models/match-info";
import Championship from "../../../../models/championship";
import { matchInfoSchema } from "../../../../validation/match-info-schema";

const createMatchInfo = async (req, res, championshipId) => {
  const { error } = matchInfoSchema.validate(req.body);

  if (error)
    return res.status(500).send(error.details.map((e) => e.message).join("\n"));

  const time = new Date(`${req.body.date}-${req.body.time}`);

  const matchInfo = new MatchInfo({
    time: time,
    arena: req.body.arena,
    city: req.body.city,
    team1: req.body.team1,
    team2: req.body.team2,
    matchId: req.body.matchId,
    matchGroupId: req.body.matchGroupId,
  });
  const newMatchInfo = await matchInfo.save();

  const championship = await Championship.findById(championshipId);
  championship.matchInfos.push(newMatchInfo._id);
  await championship.save();

  res.status(201).end();
};

export default function handler(req, res) {
  const { championshipId } = req.query;
  if (req.method === "POST") {
    return createMatchInfo(req, res, championshipId);
  } else if (req.method === "GET") {
    console.log("hej");
  }
}
