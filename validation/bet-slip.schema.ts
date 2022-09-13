import * as Joi from "@hapi/joi";
//@ts-ignore
import ObjectId from "joi-objectid";
import { join } from "path";

export const betSlipIdSchema = Joi.object({
  betSlipId: ObjectId(Joi)().required(),
});

export const betSlipSchema = Joi.object({
  bets: Joi.array().items(
    Joi.object({
      team1Score: Joi.number().required(),
      team2Score: Joi.number().required(),
      matchId: Joi.number().required(),
      team1: ObjectId(Joi)().required(),
      team2: ObjectId(Joi)().required(),
      penaltyWinner: ObjectId(Joi)(),
      points: Joi.number(),
      pointsFromAdvancement: Joi.array().items(
        Joi.object({
          final: Joi.string(),
          points: Joi.number(),
        })
      ),
      pointsFromGoalscorer: Joi.number(),
      pointsFromGroup: Joi.array().items(
        Joi.object({
          group: Joi.string(),
          points: Joi.number(),
        })
      ),
    }).required()
  ),
  goalscorer: ObjectId(Joi)().required(),
});

export const adjustPointsSchema = Joi.object({
  name: Joi.string(),
  points: Joi.number(),
});
