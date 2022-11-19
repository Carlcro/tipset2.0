import MatchStatistics, {
  IMatchStatistics,
} from "./../../../models/matchStatistics";
import { IBet } from "./../../../models/bet";
import { NextApiRequest, NextApiResponse } from "next";
import connectDB from "../../../middleware/mongodb";
import BetSlip from "../../../models/bet-slip";
import Championship from "../../../models/championship";

function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    return createStatistics(req, res);
  } else if (req.method === "GET") {
    getMatchStatistics(req, res);
  }
}

export default connectDB(handler);

interface IMatchTally {
  matchId: number;
  team1: number;
  team2: number;
  draw: number;
}

const getMatchStatistics = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const allStats = await MatchStatistics.find();

  res.send(allStats);
};

const createStatistics = async (req: NextApiRequest, res: NextApiResponse) => {
  const championship = await Championship.findOne().populate({
    path: "matchGroups",
    populate: {
      path: "matches teams",
    },
  });

  const allBetSlips = await BetSlip.find({
    championship: championship._id,
  }).populate({
    path: "bets",
    model: "Bet",
    populate: [{ path: "team1 team2 penaltyWinner" }],
  });

  const matchTally: IMatchTally[] = [];

  allBetSlips.forEach((betslip) => {
    betslip.bets.forEach((bet: IBet) => {
      let index = matchTally.findIndex((x) => x.matchId === bet.matchId);
      let matchStat = matchTally[index];

      if (matchStat) {
        if (bet.team1Score === bet.team2Score) {
          matchStat = { ...matchStat, draw: matchStat.draw + 1 };
        } else if (bet.team1Score > bet.team2Score) {
          matchStat = { ...matchStat, team1: matchStat.team1 + 1 };
        } else {
          matchStat = { ...matchStat, team2: matchStat.team2 + 1 };
        }
        matchTally[index] = matchStat;
      } else {
        const stats: IMatchTally = {
          matchId: bet.matchId,
          team1: 0,
          team2: 0,
          draw: 0,
        };

        if (bet.team1Score === bet.team2Score) {
          matchStat = { ...stats, draw: 1 };
        } else if (bet.team1Score > bet.team2Score) {
          matchStat = { ...stats, team1: 1 };
        } else {
          matchStat = { ...stats, team2: 1 };
        }

        matchTally.push(stats);
      }
    });
  });

  const totalBets = allBetSlips.length;

  await MatchStatistics.deleteMany();

  matchTally.forEach(async (tally) => {
    const stat = new MatchStatistics({
      matchId: tally.matchId,
      team1Percentage: tally.team1 / totalBets,
      team2Percentage: tally.team2 / totalBets,
      drawPercentage: tally.draw / totalBets,
    });

    await stat.save();
  });

  res.send("Hej");
};
