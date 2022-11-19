import { Schema, model, models } from "mongoose";
import Team from "./team";

export interface IBet {
  matchId: number;
  team1Score: number;
  team2Score: number;
  team1: string;
  team2: string;
  penaltyWinner?: string;
  points?: number;
}

var BetSchema = new Schema({
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
  points: Number,
});

export default models.Bet || model<IBet>("Bet", BetSchema);
