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
  goalscorer: {
    type: Schema.Types.ObjectId,
    ref: Player,
  },
  adjustedPoints: {
    type: Number,
    default: null,
  },
  points: Number,
});

export default models.BetSlip || model("BetSlip", BetSlipSchema);
