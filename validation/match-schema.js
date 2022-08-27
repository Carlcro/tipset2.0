import * as Joi from "@hapi/joi";
//@ts-ignore
import ObjectId from "joi-objectid";

export const matchSchema = Joi.object({
  matchId: Joi.number().required(),
  team1: ObjectId(Joi)().required(),
  team2: ObjectId(Joi)().required(),
});
