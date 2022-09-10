import connectDB from "../../../middleware/mongodb";
import User from "../../../models/user";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

function handler(req, res) {
  if (req.method === "POST") {
    return createUser(req, res);
  } else if (req.method === "GET") {
    return getUser(req, res);
  } else if (req.method === "PUT") {
    updateUserName(req, res);
  }
}

export default connectDB(handler);

const createUser = async (req, res) => {
  const user = new User({
    userId: "123",
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    fullName: `${req.body.firstName} ${req.body.lastName}`,
    email: req.body.email,
  });

  const savedUser = await user.save();
  //  await autoJoinUserTournament(savedUser);

  res.status(201).send(savedUser);
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

const updateUserName = async (req, res) => {
  let user = await User.findOne({ userId: "123" });
  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  user.fullName = `${req.body.firstName} ${req.body.lastName}`;

  await user.save();

  res.status(200).send(user);
};

const getUser = async (req, res) => {
  const session = await unstable_getServerSession(req, res, authOptions);

  let user = await User.findOne({ email: session?.user.email });

  if (!user) {
    return res.status(404).send("The user with the given ID was not found.");
  } else {
    console.log("heh", user);
    res.status(200).send(user);
  }
};
