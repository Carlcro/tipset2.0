import { Schema, model, models } from "mongoose";
import Team from "./team";

var ConfigSchema = new Schema({
  bettingAllowed: { type: Boolean, default: true },
  autoJoinUserTournamentId: {
    type: Schema.Types.ObjectId,
    ref: "UserTournament",
  },
});

export default models.Config || model("Config", ConfigSchema);
