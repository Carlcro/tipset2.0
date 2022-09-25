import connectDB from "../../../middleware/mongodb";
import User from "../../../models/user";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

function handler(req, res) {
  if (req.method === "POST") {
    return updateUsername(req, res);
  } else if (req.method === "GET") {
    return getUser(req, res);
  }
}

export default connectDB(handler);

const updateUsername = async (req, res) => {
  const session = await unstable_getServerSession(req, res, authOptions);

  let user = await User.findOne({ email: session?.user.email });

  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  user.fullName = `${req.body.firstName} ${req.body.lastName}`;

  await user.save();
  //  await autoJoinUserTournament(savedUser);

  res.status(200).send(user);
};

/* const autoJoinUserTournament = async (user) => {
  const configuration = await Configuration.findOne({});
  if (configuration) {
    const userTournamentId = configuration.autoJoinUserTournamentId;
    const userTournament = await UserTournament.findById(userTournamentId);
    if (userTournament) {
      await userTournament.members.push(user._id);
      userTournament.save();
    }
  }
}; */

const getUser = async (req, res) => {
  const session = await unstable_getServerSession(req, res, authOptions);

  let user = await User.findOne({ email: session?.user.email });

  if (!user) {
    return res.status(404).send("The user with the given ID was not found.");
  } else {
    res.status(200).send(user);
  }
};
