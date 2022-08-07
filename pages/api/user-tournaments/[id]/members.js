import UserTournament from "../../../../models/user-tournament";
import User from "../../../../models/user";
import connectDB from "../../../../middleware/mongodb";

function handler(req, res) {
  if (req.method === "POST") {
    addMember(req, res);
  }
}

export default connectDB(handler);

const addMember = async (req, res) => {
  const { id } = req.query;

  const user = await User.findOne({ userId: "123" });

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
  res.status(201).send(member);
};
