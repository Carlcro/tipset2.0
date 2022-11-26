import { Schema, model, models } from "mongoose";
import Championship from "./championship";
import Player from "./player";
import Result from "./result";

var AnswerSheetSchema = new Schema({
  championship: {
    type: Schema.Types.ObjectId,
    ref: Championship,
  },
  results: [
    {
      type: Schema.Types.ObjectId,
      ref: Result,
    },
  ],
  goalscorer: {
    player: {
      type: Schema.Types.ObjectId,
      ref: Player,
    },
    goals: Number,
  },
});

export default models.AnswerSheet || model("AnswerSheet", AnswerSheetSchema);
