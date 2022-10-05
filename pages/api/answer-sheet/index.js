import AnswerSheet from "../../../models/answer-sheet";
import Result from "../../../models/result";
import Championship from "../../../models/championship";
import BetSlip from "../../../models/bet-slip";
import connectDB from "../../../middleware/mongodb";
import {
  calculateGroupResults,
  calculatePoints,
  calculatePointsFromGroup,
  getMatchPoint,
  calculateCorrectAdvanceTeam,
} from "../../../calculation";
import { calculateGoalScorer } from "../../../calculation/points/common";

function handler(req, res) {
  if (req.method === "POST") {
    return saveAnswerSheet(req, res);
  } else if (req.method === "GET") {
    return getAnswerSheet(req, res);
  }
}

export default connectDB(handler);

const saveAnswerSheet = async (req, res) => {
  /*   if (req.header("password") !== PASSWORD) {
    return res.send(401);
  }
 */

  const championship = await Championship.findOne().populate({
    path: "matchGroups",
    populate: {
      path: "matches teams",
    },
  });
  const existingAnswerSheet = await AnswerSheet.findOne({
    championship: championship._id,
  }).populate({
    path: "results",
    model: "Result",
    populate: [{ path: "team1 team2 penaltyWinner" }],
  });

  const answerSheet =
    existingAnswerSheet ||
    new AnswerSheet({
      championship: championship._id,
      goalscorer: {},
    });

  if (req.body.goalscorer) {
    answerSheet.goalscorer = {
      player: req.body.goalscorer._id,
      goals: req.body.goalscorer.goals,
    };
  } else {
    answerSheet.goalscorer = null;
  }

  await Result.deleteMany();
  await answerSheet.updateOne({ $set: { results: [] } });

  for (const resultDto of req.body.answers) {
    let result = new Result({
      matchId: resultDto.matchId,
      team1Score: resultDto.team1Score,
      team2Score: resultDto.team2Score,
      team1: resultDto.team1,
      team2: resultDto.team2,
    });

    if (resultDto.penaltyWinner) {
      result.penaltyWinner = resultDto.penaltyWinner;
    }

    await result.save();
    answerSheet.results.push(result._id);
  }

  await answerSheet.save();

  const allBetSlips = await BetSlip.find({
    championship: championship._id,
  }).populate({
    path: "bets",
    model: "Bet",
    populate: [{ path: "team1 team2 penaltyWinner" }],
  });

  const answerSheetGroupResult = calculateGroupResults(
    answerSheet.results,
    championship.matchGroups
  );

  allBetSlips.forEach(async (betSlip) => {
    const betSlipGroupResult = calculateGroupResults(
      betSlip.bets,
      championship.matchGroups
    );

    let totalPointsFromMatches = 0;

    betSlip.bets.forEach(async (bet) => {
      const outcomeResult = answerSheet.results.find(
        (x) => x.matchId === bet.matchId
      );

      if (outcomeResult) {
        const matchPoint = getMatchPoint(outcomeResult, bet);
        totalPointsFromMatches += matchPoint;
        bet.points = matchPoint;
        await bet.save();
      }
    });
    const pointsFromGroup = betSlipGroupResult.map((groupResult, i) => {
      return {
        group: groupResult.name,
        points: calculatePointsFromGroup(
          groupResult,
          answerSheetGroupResult[i],
          betSlip.bets,
          answerSheet.results
        ),
      };
    });

    betSlip.pointsFromGroup = pointsFromGroup;

    const pointsFromAdvancement = calculateCorrectAdvanceTeam(
      betSlip.bets,
      answerSheet.results
    );

    betSlip.pointsFromAdvancement = pointsFromAdvancement;

    const goalScorerPoints = calculateGoalScorer(
      betSlip.goalscorer,
      answerSheet.goalscorer
    );

    betSlip.pointsFromGoalscorer = goalScorerPoints;

    const totalPointsFromGroup = pointsFromGroup.reduce(
      (acc, x) => acc + x.points,
      0
    );

    const totalPointsFromAdvancement = pointsFromAdvancement.reduce(
      (acc, x) => acc + x.points,
      0
    );

    betSlip.points =
      totalPointsFromMatches +
      totalPointsFromGroup +
      totalPointsFromAdvancement +
      goalScorerPoints;

    await betSlip.save();
  });

  res.status(201).end();
};

const getAnswerSheet = async (_, res) => {
  const championship = await Championship.findOne();

  const answerSheet = await AnswerSheet.findOne({
    championship: championship._id,
  })
    .populate({
      path: "results",
      model: "Result",
      populate: [{ path: "team1 team2 penaltyWinner" }],
    })
    .populate({
      path: "goalscorer",
      populate: {
        path: "player",
        model: "Player",
      },
    });

  if (!answerSheet) {
    res.status(404).send("No answer sheet found");
  }

  res.send(answerSheet);
};
