import UserTournament from "../../../../models/user-tournament";
import User from "../../../../models/user";
import connectDB from "../../../../middleware/mongodb";

function handler(req, res) {
  if (req.method === "POST") {
    return leaveUserTournament(req, res);
  } else if (req.method === "GET") {
    return getUserTournament(req, res);
  }
}

export default connectDB(handler);

const leaveUserTournament = async (req, res) => {
  const { id } = req.query;

  const user = await User.findOne({ userId: "123" });
  const userTournament = await UserTournament.findById(id);

  if (userTournament.owner.toString() === user._id.toString()) {
    return res.status(405).send("Du kan inte lämna en grupp du styr.");
  }

  const newMemberList = userTournament.members.filter(
    (x) => x._id.toString() !== user._id.toString()
  );

  userTournament.members = newMemberList;
  await userTournament.save();

  return res
    .status(200)
    .send(`Du är inte längre med i gruppen ${userTournament.name}`);
};

const getUserTournament = async (req, res) => {
  const { id } = req.query;

  const user = await User.findOne({ userId: "123" });

  const userTournament = await UserTournament.findById(id).populate({
    path: "members",
    populate: {
      path: "betSlip",
      model: "BetSlip",
      populate: {
        path: "bets",
        model: "Bet",
        populate: [{ path: "team1 team2 penaltyWinner" }],
      },
    },
  });

  if (userTournament === null) {
    return res.sendStatus(404);
  }

  if (
    userTournament.members.some(
      (member) => member._id.toString() === user._id.toString()
    )
  ) {
    return res.send(userTournament);
  }

  return res.status(403).send("Kan inte hämta gruppen");
};
