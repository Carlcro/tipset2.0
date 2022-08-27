import connectDB from "../../../middleware/mongodb";
import Team from "../../../models/team";
import { teamSchema } from "../../../validation/team-schema";

const createTeam = async (req, res) => {
  /*  if (req.header('password') !== PASSWORD) {
    return res.send(401)
    
  } */

  const { error } = teamSchema.validate(req.body);

  if (error)
    return res.status(500).send(error.details.map((e) => e.message).join("\n"));

  const team = new Team({ name: req.body.name });

  const newTeam = await team.save();
  return res.send(newTeam);
};

function handler(req, res) {
  if (req.method === "POST") {
    return createTeam(req, res);
  }
}

export default connectDB(handler);
