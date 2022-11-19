import { Schema, model, models } from "mongoose";

export interface IMatchStatistics {
  matchId: number;
  team1Percentage: number;
  team2Percentage: number;
  drawPercentage: number;
}

var MatchStatisticsSchema = new Schema({
  matchId: Number,
  team1Percentage: { type: Number, default: 0 },
  team2Percentage: { type: Number, default: 0 },
  drawPercentage: { type: Number, default: 0 },
});

export default models.MatchStatistics ||
  model<IMatchStatistics>("MatchStatistics", MatchStatisticsSchema);
