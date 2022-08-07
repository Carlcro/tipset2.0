import { Schema, model, models } from "mongoose";

const MatchInfoSchema = new Schema({
  time: Date,
  arena: String,
  city: String,
  team1: String,
  team2: String,
  matchId: Number,
  matchGroupId: String,
});

export default models.MatchInfo || model("MatchInfo", MatchInfoSchema);
