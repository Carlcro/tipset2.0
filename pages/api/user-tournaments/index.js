import UserTournament from "../../../models/user-tournament";
import User from "../../../models/user";
import Championship from "../../../models/championship";
import connectDB from "../../../middleware/mongodb";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

function handler(req, res) {
  if (req.method === "POST") {
    return createUserTournament(req, res);
  } else if (req.method === "GET") {
    return getUserTournaments(req, res);
  }
}

export default connectDB(handler);

const createUserTournament = async (req, res) => {
  const session = await unstable_getServerSession(req, res, authOptions);
  const user = await User.findOne({ email: session?.user.email });

  const currentChampionship = await Championship.findOne();
  const userTournament = new UserTournament({
    name: req.body.name,
    championship: currentChampionship._id,
    owner: user._id,
    members: [user._id],
  });

  const newUserTournament = await userTournament.save();
  res.send(newUserTournament);
};

const getUserTournaments = async (req, res) => {
  const session = await unstable_getServerSession(req, res, authOptions);
  const user = await User.findOne({ email: session?.user.email });

  const userTournaments = await UserTournament.find({
    members: { $in: user._id },
  }).populate("members", ["name", "email"]);

  res.send(userTournaments);
};
