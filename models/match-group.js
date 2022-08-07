import { Schema, model, models } from "mongoose";
import Team from "./team";
import Match from "./match";

const MatchGroupSchema = new Schema({
  name: String,
  teams: [
    {
      type: Schema.Types.ObjectId,
      ref: Team,
    },
  ],
  matches: [
    {
      type: Schema.Types.ObjectId,
      ref: Match,
    },
  ],
});

export default models.MatchGroup || model("MatchGroup", MatchGroupSchema);
