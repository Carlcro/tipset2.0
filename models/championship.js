import { Schema, model, models } from "mongoose";
import MatchGroup from "./match-group";
import MatchInfo from "./match-info";

const ChampionshipSchema = new Schema({
  name: String,
  matchGroups: [
    {
      type: Schema.Types.ObjectId,
      ref: MatchGroup,
    },
  ],
  matchInfos: [
    {
      type: Schema.Types.ObjectId,
      ref: MatchInfo,
    },
  ],
});

export default models.Championship || model("Championship", ChampionshipSchema);
