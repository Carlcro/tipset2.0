import connectDB from "../../../middleware/mongodb";
import BetSlip from "../../../models/bet-slip";
import User from "../../../models/user";

async function handler(req, res) {
  if (req.method === "GET") {
    return getPlacedBet(req, res);
  }
}

const getPlacedBet = async (req, res) => {
  const { id } = req.query;

  const user = await User.findById(id);

  const betSlip = await BetSlip.findById(user.betSlip)
    .populate({
      path: "bets",
      model: "Bet",
      populate: [{ path: "team1 team2 penaltyWinner" }],
    })
    .populate({ path: "goalscorer", model: "Player" });

  if (!betSlip) {
    return res.status(404).send("Användaren har inte lagt något tips");
  }

  res.send({ betSlip, name: user.fullName });
};

export default connectDB(handler);
