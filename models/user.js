import { Schema, model, models } from "mongoose";
import BetSlip from "./bet-slip";

var UserSchema = new Schema({
  password: String,
  fullName: String,
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true,
    lowercase: true,
  },
  betSlip: {
    type: Schema.Types.ObjectId,
    ref: BetSlip,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export default models.User || model("User", UserSchema);
