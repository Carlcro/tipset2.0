import { Schema, model, models } from "mongoose";

var PlayerSchema = new Schema({
  name: String,
});

export default models.Player || model("Player", PlayerSchema);
