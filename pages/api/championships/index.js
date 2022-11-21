import connectDB from "../../../middleware/mongodb";
import { championshipSchema } from "../../../validation/championship-schema";
import Championship from "../../../models/championship";

export const PASSWORD = "Tullinge123";

async function handler(req, res) {
  if (req.method === "POST") {
    return createChampionship(req, res);
  } else if (req.method === "GET") {
    return getOneChampionship(req, res);
  }
}

export const createChampionship = async (req, res) => {
  if (req.header("password") !== PASSWORD) {
    return res.send(401);
  }

  const { error } = championshipSchema.validate(req.body);

  if (error)
    return res.status(500).send(error.details.map((e) => e.message).join("\n"));

  const championship = new Championship({ name: req.body.name });

  try {
    const newChampionship = await championship.save();
    return res.send(newChampionship);
  } catch (error) {
    console.log(error);
  }
};

const getOneChampionship = async (req, res) => {
  const championships = await Championship.findOne()
    .populate({
      path: "matchGroups",
      populate: [
        {
          path: "matches",
          populate: [{ path: "team1 team2" }],
        },
        {
          path: "teams",
        },
      ],
    })
    .populate({
      path: "matchInfos",
    });
  return championships !== null ? res.send(championships) : res.sendStatus(404);
};

export default connectDB(handler);
