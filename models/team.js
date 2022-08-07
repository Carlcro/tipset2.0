import { Schema, model, models } from "mongoose";

const TeamSchema = new Schema({
  name: String,
  players: [
    {
      type: Schema.Types.ObjectId,
      ref: "Player",
    },
  ],
  group: String,
});

export default models.Team || model("Team", TeamSchema);
