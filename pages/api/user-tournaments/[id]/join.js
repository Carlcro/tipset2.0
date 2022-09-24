import UserTournament from "../../../../models/user-tournament";
import User from "../../../../models/user";
import connectDB from "../../../../middleware/mongodb";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

function handler(req, res) {
  if (req.method === "POST") {
    joinByLink(req, res);
  }
}

export default connectDB(handler);

const joinByLink = async (req, res) => {
  const { id } = req.query;

  const userTournament = await UserTournament.findById(id);
  const session = await unstable_getServerSession(req, res, authOptions);
  const user = await User.findOne({ email: session?.user.email });

  if (userTournament === null) {
    return res.status(404).send("Ingen grupp hittades");
  }

  if (!userTournament.members.includes(user._id)) {
    await userTournament.members.push(user._id);
    await userTournament.save();
  }

  return res.status(201).send(user);
};
