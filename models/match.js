import { Schema, model, models } from "mongoose";
import Team from "./team";

const MatchSchema = new Schema({
  matchId: Number,
  team1: {
    type: Schema.Types.ObjectId,
    ref: Team,
  },
  team2: {
    type: Schema.Types.ObjectId,
    ref: Team,
  },
});

export default models.Match || model("Match", MatchSchema);
