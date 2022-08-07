import * as Joi from "@hapi/joi";

export const matchInfoSchema = Joi.object({
  date: Joi.date().required(),
  time: Joi.string().required(),
  arena: Joi.string().required(),
  city: Joi.string().required(),
  team1: Joi.string().required(),
  team2: Joi.string().required(),
  matchId: Joi.number().required(),
  matchGroupId: Joi.string(),
});
