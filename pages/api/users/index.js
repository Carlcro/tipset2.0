import connectDB from "../../../middleware/mongodb";
import User from "../../../models/user";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import Config from "../../../models/config";
import UserTournament from "../../../models/user-tournament";

function handler(req, res) {
  if (req.method === "POST") {
    return updateUsername(req, res);
  } else if (req.method === "GET") {
    return getUser(req, res);
  }
}

export default connectDB(handler);

const updateUsername = async (req, res) => {
  const configuration = await Config.findOne();

  if (configuration && !configuration.bettingAllowed) {
    return res.send("Du kan inte längre byta namn");
  }

  const session = await unstable_getServerSession(req, res, authOptions);

  let user = await User.findOne({ email: session?.user.email });

  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  user.fullName = `${req.body.firstName} ${req.body.lastName}`;

  await user.save();
  await autoJoinUserTournament(user);

  res.status(200).send(user);
};

const autoJoinUserTournament = async (user) => {
  const configuration = await Config.findOne();
  if (configuration && configuration.bettingAllowed) {
    const userTournamentId = configuration.autoJoinUserTournamentId;
    const userTournament = await UserTournament.updateOne(
      { _id: userTournamentId },
      { $addToSet: { members: user._id } }
    );
  }
};

const getUser = async (req, res) => {
  const session = await unstable_getServerSession(req, res, authOptions);

  let user = await User.findOne({ email: session?.user.email });

  if (!user) {
    return res.status(404).send("The user with the given ID was not found.");
  } else {
    res.status(200).send(user);
  }
};
