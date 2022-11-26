import AnswerSheet from "../../../models/answer-sheet";
import Result from "../../../models/result";
import Championship from "../../../models/championship";
import connectDB from "../../../middleware/mongodb";

function handler(req, res) {
  if (req.method === "POST") {
    return saveAnswerSheet(req, res);
  } else if (req.method === "GET") {
    return getAnswerSheet(req, res);
  }
}

export default connectDB(handler);

const saveAnswerSheet = async (req, res) => {
  if (req.headers["password"] !== process.env.API_SECRET_KEY) {
    return res.status(401).send("Fel lösenord");
  }

  const championship = await Championship.findOne().populate({
    path: "matchGroups",
    populate: {
      path: "matches teams",
    },
  });
  /* await AnswerSheet.deleteMany();
  await Result.deleteMany(); */

  const answerSheet = new AnswerSheet({
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

    //await result.save();
    answerSheet.results.push(result._id);
  }

  //await answerSheet.save();

  res.status(201).send("Sparat Answer sheer");
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
