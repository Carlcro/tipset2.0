import * as Joi from "@hapi/joi";
//@ts-ignore
import ObjectId from "joi-objectid";

export const championshipSchema = Joi.object({
  name: Joi.string().required(),
});

export const championshipIdSchema = Joi.object({
  id: ObjectId(Joi)().required(),
});

export const answerSheetSchema = Joi.object({
  answers: Joi.array().required(),
  goalscorer: Joi.object({
    id: ObjectId(Joi)(),
    goals: Joi.number(),
  }),
});
