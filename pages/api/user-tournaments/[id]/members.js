import UserTournament from "../../../../models/user-tournament";
import User from "../../../../models/user";
import connectDB from "../../../../middleware/mongodb";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

function handler(req, res) {
  if (req.method === "POST") {
    return addMember(req, res);
  }
  if (req.method === "PUT") {
    return kickMember(req, res);
  }
}

export default connectDB(handler);

const kickMember = async (req, res) => {
  const { id } = req.query;

  const session = await unstable_getServerSession(req, res, authOptions);
  const user = await User.findOne({ email: session?.user.email });

  const userTournament = await UserTournament.findById(id);
  const member = await User.findOne({ email: req.body.email }).populate({
    path: "betSlip",
    populate: "bets",
  });

  if (!member) {
    return res.status(404).send(`Användaren hittades inte.`);
  }
  if (userTournament === null) {
    return res.status(404).send("Hittade inte gruppen.");
  }

  if (userTournament.owner.toString() !== user._id.toString()) {
    return res
      .status(400)
      .send("Du måste vara gruppens skapare för att kunna kicka medlemmar");
  }

  userTournament.members = userTournament.members.filter(
    (x) => x.toString() !== member._id.toString()
  );

  await userTournament.save();
  return res.status(200).send("Success!");
};

const addMember = async (req, res) => {
  const { id } = req.query;

  const session = await unstable_getServerSession(req, res, authOptions);
  const user = await User.findOne({ email: session?.user.email });

  const userTournament = await UserTournament.findById(id);
  const member = await User.findOne({ email: req.body.email }).populate({
    path: "betSlip",
    populate: "bets",
  });

  if (!member) {
    return res
      .status(404)
      .send(`Användaren med email: ${req.body.email} hittades inte.`);
  }
  if (userTournament === null) {
    return res.status(404).send("Hittade inte gruppen.");
  }

  if (!userTournament.members.includes(user._id)) {
    return res.status(400).send("Du måste själv vara med i gruppen.");
  }

  if (userTournament.members.includes(member._id)) {
    return res.status(400).send("Användare finns redan i gruppen.");
  }

  userTournament.members.push(member._id);
  await userTournament.save();
  return res.status(201).send(member);
};
