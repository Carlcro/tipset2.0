import { betSlipSchema } from "../../../validation/bet-slip.schema";
import User from "../../../models/user";
import Championship from "../../../models/championship";
import BetSlip from "../../../models/bet-slip";
import Bet from "../../../models/bet";
import connectDB from "../../../middleware/mongodb";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import Config from "../../../models/config";

function handler(req, res) {
  if (req.method === "POST") {
    return createBetSlip(req, res);
  } else if (req.method === "GET") {
    return getBetSlip(req, res);
  }
}

export default connectDB(handler);

const createBetSlip = async (req, res) => {
  const config = await Config.findOne();
  if (!config.bettingAllowed) {
    return res.status(403).send("Det går inte längre att lägga ett tips");
  }

  const { error } = betSlipSchema.validate(req.body);

  if (error)
    return res.status(400).send(error.details.map((e) => e.message).join("\n"));

  const session = await unstable_getServerSession(req, res, authOptions);
  const user = await User.findOne({ email: session?.user.email });

  if (!user) {
    return res.status(404).send("The user not found.");
  }

  const championship = await Championship.findOne();

  if (user.betSlip) {
    const betSlip = await BetSlip.findById(user.betSlip);
    await Bet.deleteMany({ _id: { $in: betSlip.bets } });
    await BetSlip.findByIdAndDelete(user.betSlip._id);
  }

  const betSlip = new BetSlip({
    user: user._id,
    championship: championship._id,
    goalscorer: req.body.goalscorer,
  });

  for (const result of req.body.bets) {
    let bet = new Bet({
      matchId: result.matchId,
      team1Score: result.team1Score,
      team2Score: result.team2Score,
      team1: result.team1,
      team2: result.team2,
    });

    if (result.penaltyWinner) {
      bet.penaltyWinner = result.penaltyWinner;
    }

    await bet.save();
    betSlip.bets.push(bet._id);
  }

  await betSlip.save();

  user.betSlip = betSlip._id;

  const newBetSlip = await BetSlip.findById(betSlip._id)
    .populate({
      path: "bets",
      model: "Bet",
      populate: [{ path: "team1 team2 penaltyWinner points" }],
    })
    .populate({ path: "goalscorer", model: "Player" });

  await user.save();

  res.send(newBetSlip);
};

const getBetSlip = async (req, res) => {
  const session = await unstable_getServerSession(req, res, authOptions);
  let user = await User.findOne({ email: session?.user.email });

  if (!user) {
    return res.status(404).send("The user not found.");
  }

  if (!user.betSlip) {
    return res.status(404).send("Betslip not found");
  }

  const betSlip = await BetSlip.findById(user.betSlip)
    .populate({
      path: "bets",
      model: "Bet",
      populate: [{ path: "team1 team2 penaltyWinner" }],
    })
    .populate({ path: "goalscorer", model: "Player" });

  res.send(betSlip);
};

const setAdjustedPoints = async (req, res) => {
  if (req.header("password") !== PASSWORD) {
    return res.send(401);
  }

  let user = await User.findOne({ fullName: req.body.name });

  if (!user) {
    return res.status(404).send("The user with the given ID was not found.");
  }

  let betSlip = await BetSlip.findById(user.betSlip);

  if (!betSlip) {
    return res.status(404).send("Användaren har inte lagt något tips");
  }

  betSlip.adjustedPoints = req.body.points;

  await betSlip.save();

  res.status(200).send(betSlip);
};
