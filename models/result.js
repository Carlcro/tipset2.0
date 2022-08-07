import { Schema, model, models } from "mongoose";
import Team from "./team";

var ResultSchema = new Schema({
  matchId: Number,
  team1Score: Number,
  team2Score: Number,
  team1: {
    type: Schema.Types.ObjectId,
    ref: Team,
  },
  team2: {
    type: Schema.Types.ObjectId,
    ref: Team,
  },
  penaltyWinner: {
    type: Schema.Types.ObjectId,
    ref: Team,
  },
});

export default models.Result || model("Result", ResultSchema);
