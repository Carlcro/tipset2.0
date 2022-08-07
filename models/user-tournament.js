import { Schema, model, models } from "mongoose";
import User from "./user";
import Championship from "./championship";

var UserTournamentSchema = new Schema({
  name: String,
  championship: { type: Schema.Types.ObjectId, ref: Championship },
  owner: {
    type: Schema.Types.ObjectId,
    ref: User,
  },
  members: [
    {
      type: Schema.Types.ObjectId,
      ref: User,
    },
  ],
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export default models.UserTournament ||
  model("UserTournament", UserTournamentSchema);
