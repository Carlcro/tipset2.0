import { Schema, model, models } from "mongoose";
import Bet from "./bet";
import Player from "./player";
import Championship from "./championship";

var BetSlipSchema = new Schema({
  user: {
    type: String,
    ref: "User",
  },
  championship: {
    type: Schema.Types.ObjectId,
    ref: Championship,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  bets: [
    {
      type: Schema.Types.ObjectId,
      ref: Bet,
    },
  ],
  pointsFromGroup: [
    {
      group: String,
      points: Number,
    },
  ],
  pointsFromAdvancement: [{ final: String, points: Number }],
  pointsFromGoalscorer: Number,
  goalscorer: {
    type: Schema.Types.ObjectId,
    ref: Player,
  },
  points: { type: [{ matchId: Number, points: Number }], default: [] },
});

export default models.BetSlip || model("BetSlip", BetSlipSchema);
